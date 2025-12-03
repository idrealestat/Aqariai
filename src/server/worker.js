// =======================================================
// Background Worker - معالج المهام في الخلفية
// معالجة النشر على المنصات والإشعارات والمهام الثقيلة
// =======================================================

const { Queue, Worker, QueueScheduler } = require('bullmq');
const db = require('./config/database');
const Redis = require('ioredis');

// إعداد اتصال Redis
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
});

// إنشاء جدولة المهام
const publishScheduler = new QueueScheduler('publish_jobs', { connection });
const notificationScheduler = new QueueScheduler('notifications', { connection });

// =======================================================
// Workers
// =======================================================

// Worker لمعالجة النشر على المنصات
const publishWorker = new Worker(
  'publish_jobs',
  async (job) => {
    console.log(`📤 معالجة مهمة النشر: ${job.id}`, job.data);

    const { publish_job_id, listing_id, platform_account_id } = job.data;

    try {
      // جلب تفاصيل المهمة من قاعدة البيانات
      const jobResult = await db.query(`
        SELECT pj.*, l.title, l.price, pa.api_key, pa.account_identifier, 
               plat.key as platform_key, plat.name as platform_name,
               p.title as property_title, p.description, p.city, p.type
        FROM publish_jobs pj
        JOIN listings l ON pj.listing_id = l.id
        JOIN properties p ON l.property_id = p.id
        JOIN platform_accounts pa ON pj.platform_account_id = pa.id
        JOIN platforms plat ON pa.platform_id = plat.id
        WHERE pj.id = $1
      `, [publish_job_id]);

      if (jobResult.rows.length === 0) {
        throw new Error('مهمة النشر غير موجودة');
      }

      const jobData = jobResult.rows[0];

      // تحديث حالة المهمة إلى "جاري التنفيذ"
      await db.query(`
        UPDATE publish_jobs 
        SET status = 'in_progress', started_at = NOW(), attempts = attempts + 1
        WHERE id = $1
      `, [publish_job_id]);

      // محاكاة نشر على المنصة (في التطبيق الحقيقي يكون API call)
      const publishResult = await mockPublishToPlatform(jobData);

      // تحديث المهمة بالنجاح
      await db.query(`
        UPDATE publish_jobs 
        SET 
          status = 'success',
          platform_response = $2,
          platform_url = $3,
          finished_at = NOW()
        WHERE id = $1
      `, [
        publish_job_id,
        JSON.stringify(publishResult.response),
        publishResult.platform_url
      ]);

      // تحديث الإعلان
      await db.query(`
        UPDATE listings 
        SET 
          status = 'published',
          platform_listing_meta = platform_listing_meta || $2
        WHERE id = $1
      `, [
        listing_id,
        JSON.stringify({
          [jobData.platform_key]: {
            id: publishResult.platform_listing_id,
            url: publishResult.platform_url,
            published_at: new Date().toISOString()
          }
        })
      ]);

      // إرسال إشعار للوسيط
      await notifyAgent(jobData.workspace_id, {
        type: 'publish_success',
        title: 'تم النشر بنجاح',
        message: `تم نشر "${jobData.property_title}" على ${jobData.platform_name}`,
        data: {
          listing_id,
          platform_url: publishResult.platform_url
        }
      });

      console.log(`✅ تم نشر العقار بنجاح على ${jobData.platform_name}: ${publishResult.platform_url}`);
      
      return { 
        success: true, 
        platform_url: publishResult.platform_url,
        platform_listing_id: publishResult.platform_listing_id
      };

    } catch (error) {
      console.error(`❌ فشل النشر للمهمة ${publish_job_id}:`, error);

      // تحديث المهمة بالفشل
      await db.query(`
        UPDATE publish_jobs 
        SET 
          status = 'failed',
          platform_response = $2,
          finished_at = NOW()
        WHERE id = $1
      `, [publish_job_id, JSON.stringify({ error: error.message })]);

      // إرسال إشعار بالفشل
      const jobData = await db.query('SELECT * FROM publish_jobs WHERE id = $1', [publish_job_id]);
      if (jobData.rows.length > 0) {
        await notifyAgent(jobData.rows[0].workspace_id, {
          type: 'publish_failed',
          title: 'فشل في النشر',
          message: `فشل نشر الإعلان: ${error.message}`,
          data: { publish_job_id }
        });
      }

      throw error;
    }
  },
  {
    connection,
    concurrency: 3,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
);

// Worker للإشعارات
const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    console.log(`🔔 إرسال إشعار: ${job.id}`, job.data);

    const { user_id, workspace_id, type, title, message, data, channels } = job.data;

    try {
      // حفظ الإشعار في قاعدة البيانات
      const result = await db.query(`
        INSERT INTO notifications (user_id, workspace_id, type, title, message, data)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [user_id, workspace_id, type, title, message, JSON.stringify(data || {})]);

      const notificationId = result.rows[0].id;

      // إرسال عبر القنوات المختلفة
      if (channels && channels.includes('realtime')) {
        // إرسال realtime notification
        await db.query("NOTIFY realtime_notifications, $1", [
          JSON.stringify({
            user_id,
            workspace_id,
            notification: {
              id: notificationId,
              type,
              title,
              message,
              data,
              created_at: new Date().toISOString()
            }
          })
        ]);
      }

      if (channels && channels.includes('email')) {
        // إرسال بريد إلكتروني (mock)
        console.log(`📧 إرسال إيميل إلى المستخدم ${user_id}: ${title}`);
      }

      if (channels && channels.includes('sms')) {
        // إرسال SMS (mock)
        console.log(`📱 إرسال SMS إلى المستخدم ${user_id}: ${title}`);
      }

      return { success: true, notification_id: notificationId };

    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5
  }
);

// =======================================================
// Helper Functions
// =======================================================

// محاكاة النشر على المنصة
const mockPublishToPlatform = async (jobData) => {
  // محاكاة زمن الاستجابة
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // محاكاة نسبة نجاح 85%
  if (Math.random() > 0.15) {
    const platformListingId = `${jobData.platform_key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      platform_listing_id: platformListingId,
      platform_url: `https://${jobData.platform_key}.com/listing/${platformListingId}`,
      response: {
        id: platformListingId,
        status: 'published',
        message: 'تم النشر بنجاح',
        views: 0,
        created_at: new Date().toISOString()
      }
    };
  } else {
    throw new Error(`خطأ في منصة ${jobData.platform_name}: فشل في الاتصال`);
  }
};

// إرسال إشعار للوسيط
const notifyAgent = async (workspaceId, notification) => {
  try {
    // جلب المستخدمين في مساحة العمل
    const users = await db.query(`
      SELECT u.id 
      FROM users u 
      JOIN user_workspaces uw ON u.id = uw.user_id 
      WHERE uw.workspace_id = $1 AND uw.status = 'active'
    `, [workspaceId]);

    // إرسال إشعار لكل مستخدم
    for (const user of users.rows) {
      const notificationQueue = new Queue('notifications', { connection });
      await notificationQueue.add('send_notification', {
        user_id: user.id,
        workspace_id: workspaceId,
        ...notification,
        channels: ['realtime', 'email']
      });
    }
  } catch (error) {
    console.error('خطأ في إرسال الإشعار:', error);
  }
};

// =======================================================
// Queue Management Functions
// =======================================================

// إضافة مهمة نشر جديدة
const addPublishJob = async (publishJobId, listingId, platformAccountId, scheduleDelay = 0) => {
  const publishQueue = new Queue('publish_jobs', { connection });
  
  const jobOptions = scheduleDelay > 0 ? { delay: scheduleDelay } : {};
  
  const job = await publishQueue.add('publish_to_platform', {
    publish_job_id: publishJobId,
    listing_id: listingId,
    platform_account_id: platformAccountId
  }, jobOptions);

  console.log(`📋 تمت إضافة مهمة النشر: ${job.id}`);
  return job.id;
};

// إضافة مهمة إشعار جديدة
const addNotificationJob = async (userId, workspaceId, notification) => {
  const notificationQueue = new Queue('notifications', { connection });
  
  const job = await notificationQueue.add('send_notification', {
    user_id: userId,
    workspace_id: workspaceId,
    ...notification,
    channels: ['realtime']
  });

  return job.id;
};

// =======================================================
// Event Handlers
// =======================================================

publishWorker.on('completed', (job, result) => {
  console.log(`✅ مهمة النشر ${job.id} اكتملت بنجاح:`, result);
});

publishWorker.on('failed', (job, error) => {
  console.log(`❌ مهمة النشر ${job.id} فشلت:`, error.message);
});

notificationWorker.on('completed', (job, result) => {
  console.log(`🔔 إشعار ${job.id} تم إرساله بنجاح`);
});

notificationWorker.on('failed', (job, error) => {
  console.log(`❌ فشل إرسال الإشعار ${job.id}:`, error.message);
});

// =======================================================
// Graceful Shutdown
// =======================================================

process.on('SIGTERM', async () => {
  console.log('⏹️ إيقاف Worker...');
  
  await publishWorker.close();
  await notificationWorker.close();
  await publishScheduler.close();
  await notificationScheduler.close();
  await connection.quit();
  
  console.log('🛑 تم إيقاف Worker بنجاح');
  process.exit(0);
});

// =======================================================
// Start Message
// =======================================================

console.log('🚀 Worker بدأ العمل...');
console.log('📤 معالج النشر: متاح');
console.log('🔔 معالج الإشعارات: متاح');

module.exports = {
  addPublishJob,
  addNotificationJob,
  publishWorker,
  notificationWorker
};