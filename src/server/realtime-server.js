// =======================================================
// Realtime Server - خادم الإشعارات المباشرة
// WebSocket + PostgreSQL LISTEN/NOTIFY للتحديثات المباشرة
// =======================================================

const { Server } = require('socket.io');
const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const http = require('http');

// إنشاء HTTP server للـ Socket.IO
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io'
});

// إعداد اتصال PostgreSQL للـ LISTEN
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'waseety',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

// =======================================================
// Database Listeners
// =======================================================

const setupDatabaseListeners = async () => {
  try {
    await client.connect();
    console.log('📦 متصل بقاعدة البيانات للـ Real-time');

    // الاستماع للأحداث المختلفة
    await client.query('LISTEN realtime_notifications');
    await client.query('LISTEN new_contacts');
    await client.query('LISTEN task_updates');
    await client.query('LISTEN property_updates');
    await client.query('LISTEN publish_status');

    // معالجة الإشعارات من قاعدة البيانات
    client.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload);
        console.log(`📡 حدث من قاعدة البيانات [${msg.channel}]:`, payload);
        
        // بث الحدث حسب القناة
        switch (msg.channel) {
          case 'realtime_notifications':
            handleNotificationEvent(payload);
            break;
          case 'new_contacts':
            handleNewContactEvent(payload);
            break;
          case 'task_updates':
            handleTaskUpdateEvent(payload);
            break;
          case 'property_updates':
            handlePropertyUpdateEvent(payload);
            break;
          case 'publish_status':
            handlePublishStatusEvent(payload);
            break;
          default:
            console.log('حدث غير معروف:', msg.channel, payload);
        }
      } catch (error) {
        console.error('خطأ في معالجة إشعار قاعدة البيانات:', error);
      }
    });

    client.on('error', (err) => {
      console.error('خطأ في اتصال قاعدة البيانات:', err);
    });

  } catch (error) {
    console.error('فشل في الاتصال بقاعدة البيانات:', error);
    process.exit(1);
  }
};

// =======================================================
// Socket.IO Authentication
// =======================================================

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('رمز المصادقة مطلوب'));
    }

    // التحقق من JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // جلب بيانات المستخدم
    const result = await client.query(`
      SELECT u.id, u.name, u.email, uw.workspace_id, w.name as workspace_name
      FROM users u
      JOIN user_workspaces uw ON u.id = uw.user_id
      JOIN workspaces w ON uw.workspace_id = w.id
      WHERE u.id = $1 AND uw.status = 'active'
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return next(new Error('مستخدم غير موجود'));
    }

    socket.user = result.rows[0];
    socket.workspaceId = result.rows[0].workspace_id;
    
    // انضمام إلى غرف مساحة العمل والمستخدم
    socket.join(`workspace:${socket.workspaceId}`);
    socket.join(`user:${socket.user.id}`);

    console.log(`👤 ${socket.user.name} متصل إلى مساحة العمل ${socket.workspaceId}`);
    next();
  } catch (error) {
    console.error('خطأ في المصادقة:', error);
    next(new Error('خطأ في المصادقة'));
  }
});

// =======================================================
// Socket.IO Event Handlers
// =======================================================

io.on('connection', (socket) => {
  console.log(`🔌 مستخدم متصل: ${socket.user.name} (${socket.id})`);

  // إرسال حالة الاتصال
  socket.emit('connection_status', {
    connected: true,
    user: socket.user,
    workspace_id: socket.workspaceId,
    timestamp: new Date().toISOString()
  });

  // =======================================================
  // Custom Events
  // =======================================================

  // مشاهدة عقار
  socket.on('property:view', async (data) => {
    try {
      const { property_id } = data;
      
      // تحديث عدد المشاهدات
      await client.query(`
        UPDATE properties 
        SET views_count = views_count + 1, updated_at = NOW()
        WHERE id = $1 AND workspace_id = $2
      `, [property_id, socket.workspaceId]);

      // بث التحديث لأعضاء مساحة العمل
      socket.to(`workspace:${socket.workspaceId}`).emit('property:viewed', {
        property_id,
        viewed_by: socket.user.name,
        views_count: 1, // سيتم تحديثها من قاعدة البيانات
        timestamp: new Date().toISOString()
      });

      console.log(`👁️ ${socket.user.name} شاهد العقار ${property_id}`);

    } catch (error) {
      console.error('خطأ في مشاهدة العقار:', error);
      socket.emit('error', { message: 'خطأ في تسجيل المشاهدة' });
    }
  });

  // تحديث عميل
  socket.on('contact:update', async (data) => {
    try {
      const { contact_id, changes } = data;

      // بث التحديث لأعضاء مساحة العمل
      socket.to(`workspace:${socket.workspaceId}`).emit('contact:updated', {
        contact_id,
        changes,
        updated_by: socket.user.name,
        timestamp: new Date().toISOString()
      });

      console.log(`👥 ${socket.user.name} حدث العميل ${contact_id}`);

    } catch (error) {
      console.error('خطأ في تحديث العميل:', error);
      socket.emit('error', { message: 'خطأ في تحديث العميل' });
    }
  });

  // إكمال مهمة
  socket.on('task:complete', async (data) => {
    try {
      const { task_id } = data;

      // تحديث المهمة في قاعدة البيانات
      await client.query(`
        UPDATE crm_tasks 
        SET status = 'completed', completed_at = NOW()
        WHERE id = $1 AND workspace_id = $2
      `, [task_id, socket.workspaceId]);

      // بث إشعار الإكمال
      io.to(`workspace:${socket.workspaceId}`).emit('task:completed', {
        task_id,
        completed_by: socket.user.name,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ ${socket.user.name} أكمل المهمة ${task_id}`);

    } catch (error) {
      console.error('خطأ في إكمال المهمة:', error);
      socket.emit('error', { message: 'خطأ في إكمال المهمة' });
    }
  });

  // طلب الإحصائيات المباشرة
  socket.on('dashboard:stats', async () => {
    try {
      const stats = await getDashboardStats(socket.workspaceId);
      socket.emit('dashboard:stats_update', stats);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      socket.emit('error', { message: 'خطأ في جلب الإحصائيات' });
    }
  });

  // =======================================================
  // Disconnect Handler
  // =======================================================

  socket.on('disconnect', (reason) => {
    console.log(`🔌 ${socket.user.name} انقطع الاتصال: ${reason}`);
  });
});

// =======================================================
// Database Event Handlers
// =======================================================

// معالجة إشعارات النظام
const handleNotificationEvent = (payload) => {
  const { user_id, workspace_id, notification } = payload;
  
  if (user_id) {
    // إشعار مستخدم محدد
    io.to(`user:${user_id}`).emit('notification', notification);
  } else if (workspace_id) {
    // إشعار لمساحة العمل كاملة
    io.to(`workspace:${workspace_id}`).emit('notification', notification);
  }
};

// معالجة عميل جديد
const handleNewContactEvent = (payload) => {
  const { workspace_id, contact } = payload;
  
  io.to(`workspace:${workspace_id}`).emit('contact:new', {
    contact,
    timestamp: new Date().toISOString()
  });
  
  console.log(`👤 عميل جديد في مساحة العمل ${workspace_id}: ${contact.full_name}`);
};

// معالجة تحديث المهام
const handleTaskUpdateEvent = (payload) => {
  const { workspace_id, task, action } = payload;
  
  io.to(`workspace:${workspace_id}`).emit('task:update', {
    task,
    action,
    timestamp: new Date().toISOString()
  });
};

// معالجة تحديث العقارات
const handlePropertyUpdateEvent = (payload) => {
  const { workspace_id, property, action } = payload;
  
  io.to(`workspace:${workspace_id}`).emit('property:update', {
    property,
    action,
    timestamp: new Date().toISOString()
  });
};

// معالجة حالة النشر
const handlePublishStatusEvent = (payload) => {
  const { workspace_id, listing_id, platform, status, url } = payload;
  
  io.to(`workspace:${workspace_id}`).emit('publish:status', {
    listing_id,
    platform,
    status,
    url,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📤 حالة النشر: ${listing_id} على ${platform} - ${status}`);
};

// =======================================================
// Helper Functions
// =======================================================

// جلب إحصائيات لوحة التحكم
const getDashboardStats = async (workspaceId) => {
  try {
    const result = await client.query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_properties,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as published_properties,
        COUNT(DISTINCT c.id) as total_contacts,
        COUNT(DISTINCT c.id) FILTER (WHERE c.created_at >= CURRENT_DATE - INTERVAL '7 days') as new_contacts_week,
        COUNT(DISTINCT t.id) as total_tasks,
        COUNT(DISTINCT t.id) FILTER (WHERE t.status IN ('pending', 'in_progress')) as pending_tasks
      FROM workspaces w
      LEFT JOIN properties p ON w.id = p.workspace_id
      LEFT JOIN crm_contacts c ON w.id = c.workspace_id
      LEFT JOIN crm_tasks t ON w.id = t.workspace_id
      WHERE w.id = $1
      GROUP BY w.id
    `, [workspaceId]);

    return result.rows[0] || {};
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return {};
  }
};

// بث إشعار لمساحة العمل
const broadcastToWorkspace = (workspaceId, event, data) => {
  io.to(`workspace:${workspaceId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

// بث إشعار لمستخدم محدد
const broadcastToUser = (userId, event, data) => {
  io.to(`user:${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
};

// =======================================================
// API Functions (للاستخدام من Express)
// =======================================================

const notifyNewLead = (workspaceId, leadData) => {
  broadcastToWorkspace(workspaceId, 'lead:new', {
    id: leadData.id,
    name: leadData.full_name,
    phone: leadData.phone,
    source: leadData.source,
    lead_score: leadData.lead_score
  });
};

const notifyTaskAssigned = (userId, taskData) => {
  broadcastToUser(userId, 'task:assigned', {
    id: taskData.id,
    title: taskData.title,
    priority: taskData.priority,
    due_date: taskData.due_date
  });
};

const notifyPublishComplete = (workspaceId, listingId, platformName, url) => {
  broadcastToWorkspace(workspaceId, 'publish:complete', {
    listing_id: listingId,
    platform: platformName,
    url,
    message: `تم نشر الإعلان على ${platformName} بنجاح`
  });
};

// =======================================================
// Server Startup
// =======================================================

const startRealtimeServer = async () => {
  try {
    await setupDatabaseListeners();
    
    const PORT = process.env.REALTIME_PORT || 4000;
    server.listen(PORT, () => {
      console.log(`🚀 خادم الإشعارات المباشرة يعمل على المنفذ ${PORT}`);
      console.log(`📡 Socket.IO متاح على: http://localhost:${PORT}/socket.io`);
      console.log(`🔗 اتصال قاعدة البيانات: ${process.env.DB_NAME || 'waseety'}`);
    });

  } catch (error) {
    console.error('فشل في تشغيل خادم الإشعارات المباشرة:', error);
    process.exit(1);
  }
};

// =======================================================
// Graceful Shutdown
// =======================================================

process.on('SIGTERM', async () => {
  console.log('⏹️ إيقاف خادم الإشعارات المباشرة...');
  
  try {
    await client.end();
    server.close(() => {
      console.log('🛑 تم إيقاف خادم ا��إشعارات بنجاح');
      process.exit(0);
    });
  } catch (error) {
    console.error('خطأ في الإيقاف:', error);
    process.exit(1);
  }
});

// تشغيل الخادم
if (require.main === module) {
  startRealtimeServer();
}

// =======================================================
// Exports
// =======================================================

module.exports = {
  io,
  broadcastToWorkspace,
  broadcastToUser,
  notifyNewLead,
  notifyTaskAssigned,
  notifyPublishComplete,
  startRealtimeServer
};