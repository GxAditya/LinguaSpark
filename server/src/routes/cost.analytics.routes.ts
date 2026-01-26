import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { costOptimizationService } from '../services/cost.optimization.service.js';
import { apiUsageMonitor } from '../services/api.usage.monitor.service.js';
import type { IUser } from '../models/index.js';

const router = express.Router();

/**
 * Get user's cost and usage analytics
 * GET /api/cost-analytics/user
 */
router.get('/user', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    const hours = parseInt(req.query.hours as string) || 24;

    const analytics = await costOptimizationService.getUserCostAnalytics(
      user._id.toString(),
      hours
    );

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching user cost analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cost analytics'
    });
  }
});

/**
 * Get user's detailed usage statistics
 * GET /api/cost-analytics/user/detailed
 */
router.get('/user/detailed', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    const hours = parseInt(req.query.hours as string) || 24;

    const userStats = apiUsageMonitor.getUserStats(user._id.toString(), hours);

    res.json({
      success: true,
      data: userStats
    });
  } catch (error) {
    console.error('Error fetching detailed user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve detailed statistics'
    });
  }
});

/**
 * Get model recommendations for user
 * GET /api/cost-analytics/recommendations
 */
router.get('/recommendations', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    const contentType = req.query.type as 'text' | 'image' || 'text';
    const useCase = req.query.useCase as 'speed' | 'quality' | 'cost' || 'cost';
    const userTier = 'free'; // Simplified for now

    const textRecommendation = costOptimizationService.getModelRecommendation(
      'text',
      useCase,
      userTier
    );

    const imageRecommendation = costOptimizationService.getModelRecommendation(
      'image',
      useCase,
      userTier
    );

    res.json({
      success: true,
      data: {
        text: textRecommendation,
        image: imageRecommendation,
        userTier,
        useCase
      }
    });
  } catch (error) {
    console.error('Error fetching model recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve model recommendations'
    });
  }
});

/**
 * Get system-wide cost monitoring (admin only)
 * GET /api/cost-analytics/system
 */
router.get('/system', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    
    // Simple admin check - in production, this would be more sophisticated
    if (user.email !== 'admin@linguaspark.com') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const hours = parseInt(req.query.hours as string) || 1;
    const systemMonitoring = costOptimizationService.getSystemCostMonitoring(hours);

    res.json({
      success: true,
      data: systemMonitoring
    });
  } catch (error) {
    console.error('Error fetching system cost monitoring:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system monitoring data'
    });
  }
});

/**
 * Get cost breakdown by category
 * GET /api/cost-analytics/breakdown
 */
router.get('/breakdown', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    const hours = parseInt(req.query.hours as string) || 24;

    const costBreakdown = apiUsageMonitor.getCostBreakdown(hours);

    res.json({
      success: true,
      data: costBreakdown
    });
  } catch (error) {
    console.error('Error fetching cost breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cost breakdown'
    });
  }
});

/**
 * Get performance metrics
 * GET /api/cost-analytics/performance
 */
router.get('/performance', protect, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 1;
    const performanceMetrics = apiUsageMonitor.getPerformanceMetrics(hours);

    res.json({
      success: true,
      data: performanceMetrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve performance metrics'
    });
  }
});

/**
 * Export usage data for analysis (admin only)
 * GET /api/cost-analytics/export
 */
router.get('/export', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    
    // Simple admin check
    if (user.email !== 'admin@linguaspark.com') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const startTime = new Date(req.query.startTime as string || Date.now() - 24 * 3600000);
    const endTime = new Date(req.query.endTime as string || Date.now());

    const usageData = apiUsageMonitor.exportUsageData(startTime, endTime);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="usage-data-${startTime.toISOString().split('T')[0]}-${endTime.toISOString().split('T')[0]}.json"`);
    
    res.json({
      success: true,
      data: {
        exportTime: new Date().toISOString(),
        period: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        },
        entries: usageData
      }
    });
  } catch (error) {
    console.error('Error exporting usage data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export usage data'
    });
  }
});

/**
 * Update cost optimization configuration (admin only)
 * POST /api/cost-analytics/config
 */
router.post('/config', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    
    // Simple admin check
    if (user.email !== 'admin@linguaspark.com') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { userTiers, modelSelection, alertThresholds } = req.body;

    costOptimizationService.updateConfiguration({
      userTiers,
      modelSelection,
      alertThresholds
    });

    res.json({
      success: true,
      message: 'Cost optimization configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating cost optimization config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update configuration'
    });
  }
});

/**
 * Get current rate limit status for user
 * GET /api/cost-analytics/rate-limits
 */
router.get('/rate-limits', protect, async (req, res) => {
  try {
    const user = req.user as IUser;
    const gameType = req.query.gameType as string || 'general';

    const rateLimitResult = await costOptimizationService.checkGameGenerationLimit(
      user._id.toString(),
      gameType,
      0 // No cost for checking limits
    );

    res.json({
      success: true,
      data: {
        allowed: rateLimitResult.allowed,
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
        currentCost: rateLimitResult.currentCost,
        costLimit: rateLimitResult.costLimit,
        tier: rateLimitResult.tier,
        reason: rateLimitResult.reason
      }
    });
  } catch (error) {
    console.error('Error checking rate limits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check rate limits'
    });
  }
});

export default router;