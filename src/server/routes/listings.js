// =======================================================
// Listings Routes
// create listing, publish listing - مع jobs للنشر
// =======================================================

const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// =======================================================
// Validation schemas
// =======================================================

const createListingSchema = Joi.object({
  property_id: Joi.string().uuid().required(),
  title: Joi.string().required().min(5).max(200),
  price: Joi.number().positive().required()
});

const publishListingSchema = Joi.object({
  platform_account_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
  schedule_at: Joi.date().iso().optional()
});

// =======================================================
// Helper functions
// =======================================================

// Mock platform publishing (في التطبيق الحقيقي يكون API call)
const mockPublishToPlatform = async (listing, platformAccount, platform) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock success/failure (90% success rate)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      platform_listing_id: `${platform.key}_${Date.now()}`,
      platform_url: `https://${platform.key}.com/listing/${Date.now()}`,
      response: {
        id: `${platform.key}_${Date.now()}`,
        status: 'published',
        message: 'تم النشر بنجاح'
      }
    };
  } else {
    throw new Error('فشل النشر على المنصة');
  }
};

// =======================================================
// Routes
// =======================================================

// POST /api/v1/listings
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = createListingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة',
          details: error.details.map(d => ({
            field: d.path.join('.'),
            message: d.message
          }))
        }
      });
    }

    const { property_id, title, price } = value;
    const workspaceId = req.workspaceId;

    // Verify property ownership
    const propertyResult = await db.query(
      'SELECT id FROM properties WHERE id = $1 AND workspace_id = $2',
      [property_id, workspaceId]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: 'العقار غير موجود'
        }
      });
    }

    // Create listing
    const result = await db.query(`
      INSERT INTO listings (property_id, workspace_id, title, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [property_id, workspaceId, title, price]);

    const listing = result.rows[0];

    res.status(201).json({
      success: true,
      data: listing,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء إنشاء الإعلان'
      }
    });
  }
});

// POST /api/v1/listings/:id/publish
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const listingId = req.params.id;
    const workspaceId = req.workspaceId;

    // Validate input
    const { error, value } = publishListingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'خطأ في البيانات المدخلة'
        }
      });
    }

    const { platform_account_ids, schedule_at } = value;

    // Verify listing ownership
    const listingResult = await db.query(
      'SELECT * FROM listings WHERE id = $1 AND workspace_id = $2',
      [listingId, workspaceId]
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LISTING_NOT_FOUND',
          message: 'الإعلان غير موجود'
        }
      });
    }

    // Create publish jobs
    const jobs = [];
    
    for (const accountId of platform_account_ids) {
      const jobResult = await db.query(`
        INSERT INTO publish_jobs (listing_id, platform_account_id, status)
        VALUES ($1, $2, 'pending')
        RETURNING id
      `, [listingId, accountId]);

      jobs.push({
        id: jobResult.rows[0].id,
        platform_account_id: accountId,
        status: 'pending'
      });

      // في التطبيق الحقيقي، هنا نضع المهمة في queue
      // هنا سنقوم بالنشر مباشرة للتبسيط
      processPublishJob(jobResult.rows[0].id).catch(console.error);
    }

    res.json({
      success: true,
      data: {
        jobs
      },
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Publish listing error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء نشر الإعلان'
      }
    });
  }
});

// GET /api/v1/publish-jobs/:id
router.get('/publish-jobs/:id', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const workspaceId = req.workspaceId;

    // Get job with platform info
    const result = await db.query(`
      SELECT pj.*, l.workspace_id, p.name as platform_name
      FROM publish_jobs pj
      JOIN listings l ON pj.listing_id = l.id
      JOIN platform_accounts pa ON pj.platform_account_id = pa.id
      JOIN platforms p ON pa.platform_id = p.id
      WHERE pj.id = $1 AND l.workspace_id = $2
    `, [jobId, workspaceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'مهمة النشر غير موجودة'
        }
      });
    }

    const job = result.rows[0];
    delete job.workspace_id;

    res.json({
      success: true,
      data: job,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: req.id
      }
    });

  } catch (error) {
    console.error('Get publish job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'حدث خطأ أثناء جلب حالة النشر'
      }
    });
  }
});

// =======================================================
// Background job processor (يفضل استخدام queue حقيقي)
// =======================================================

const processPublishJob = async (jobId) => {
  try {
    console.log(`📤 Processing publish job ${jobId}`);
    
    // Update job status to in_progress
    await db.query(
      'UPDATE publish_jobs SET status = $1 WHERE id = $2',
      ['in_progress', jobId]
    );

    // Get job data with listing and platform info
    const jobResult = await db.query(`
      SELECT pj.*, l.*, pa.*, p.key as platform_key, p.name as platform_name
      FROM publish_jobs pj
      JOIN listings l ON pj.listing_id = l.id
      JOIN platform_accounts pa ON pj.platform_account_id = pa.id
      JOIN platforms p ON pa.platform_id = p.id
      WHERE pj.id = $1
    `, [jobId]);

    if (jobResult.rows.length === 0) {
      throw new Error('Job not found');
    }

    const jobData = jobResult.rows[0];

    // Mock publish to platform
    const platformResult = await mockPublishToPlatform(
      jobData,
      { id: jobData.platform_account_id, api_key: jobData.api_key },
      { key: jobData.platform_key, name: jobData.platform_name }
    );

    // Update job with success
    await db.query(`
      UPDATE publish_jobs 
      SET status = $1, platform_response = $2, platform_url = $3, finished_at = NOW()
      WHERE id = $4
    `, ['success', JSON.stringify(platformResult.response), platformResult.platform_url, jobId]);

    // Update listing status
    await db.query(
      'UPDATE listings SET status = $1 WHERE id = $2',
      ['published', jobData.listing_id]
    );

    console.log(`✅ Job ${jobId} completed successfully`);

  } catch (error) {
    console.error(`❌ Job ${jobId} failed:`, error);
    
    // Update job with failure
    await db.query(`
      UPDATE publish_jobs 
      SET status = $1, platform_response = $2, finished_at = NOW()
      WHERE id = $3
    `, ['failed', JSON.stringify({ error: error.message }), jobId]);
  }
};

module.exports = router;