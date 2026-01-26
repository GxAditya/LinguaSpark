import { costOptimizationService } from './cost.optimization.service.js';
import { apiUsageMonitor } from './api.usage.monitor.service.js';

/**
 * Model performance metrics
 */
interface ModelMetrics {
  model: string;
  averageResponseTime: number;
  successRate: number;
  averageCost: number;
  qualityScore: number;
  usageCount: number;
  lastUsed: Date;
}

/**
 * Use case context for model selection
 */
interface UseCaseContext {
  gameType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  targetLanguage: string;
  userTier: string;
  priority: 'speed' | 'quality' | 'cost';
  contentLength?: 'short' | 'medium' | 'long';
  imageComplexity?: 'simple' | 'detailed';
}

/**
 * Model selection result
 */
interface ModelSelectionResult {
  selectedModel: string;
  reason: string;
  confidence: number;
  alternatives: Array<{
    model: string;
    score: number;
    reason: string;
  }>;
  estimatedCost: number;
  estimatedResponseTime: number;
  estimatedQuality: number;
}

/**
 * Model Selection Service
 * Intelligently selects optimal models based on use case, performance history, and cost constraints
 */
export class ModelSelectionService {
  private modelMetrics: Map<string, ModelMetrics> = new Map();
  private selectionHistory: Array<{
    context: UseCaseContext;
    selectedModel: string;
    actualCost: number;
    actualResponseTime: number;
    success: boolean;
    timestamp: Date;
  }> = [];

  constructor() {
    this.initializeModelMetrics();
    
    // Update metrics periodically
    setInterval(() => this.updateModelMetrics(), 300000); // Every 5 minutes
  }

  /**
   * Select optimal model based on use case context
   */
  selectModel(
    contentType: 'text' | 'image',
    context: UseCaseContext
  ): ModelSelectionResult {
    const availableModels = this.getAvailableModels(contentType);
    const scoredModels = availableModels.map(model => ({
      model: model.name,
      score: this.calculateModelScore(model, context),
      reason: this.getSelectionReason(model, context)
    }));

    // Sort by score (highest first)
    scoredModels.sort((a, b) => b.score - a.score);

    const selectedModel = scoredModels[0];
    const alternatives = scoredModels.slice(1, 4); // Top 3 alternatives

    const modelInfo = availableModels.find(m => m.name === selectedModel.model)!;
    const metrics = this.modelMetrics.get(selectedModel.model);

    return {
      selectedModel: selectedModel.model,
      reason: selectedModel.reason,
      confidence: selectedModel.score / 100, // Normalize to 0-1
      alternatives,
      estimatedCost: this.estimateCost(modelInfo, context),
      estimatedResponseTime: metrics?.averageResponseTime || this.getDefaultResponseTime(modelInfo),
      estimatedQuality: modelInfo.qualityScore
    };
  }

  /**
   * Record model usage for learning
   */
  recordModelUsage(
    context: UseCaseContext,
    selectedModel: string,
    actualCost: number,
    actualResponseTime: number,
    success: boolean
  ): void {
    // Add to selection history
    this.selectionHistory.push({
      context,
      selectedModel,
      actualCost,
      actualResponseTime,
      success,
      timestamp: new Date()
    });

    // Limit history size
    if (this.selectionHistory.length > 1000) {
      this.selectionHistory.shift();
    }

    // Update model metrics
    this.updateModelMetric(selectedModel, actualCost, actualResponseTime, success);

    console.log(`Model usage recorded: ${selectedModel} - Cost: $${actualCost.toFixed(4)} - Time: ${actualResponseTime}ms - Success: ${success}`);
  }

  /**
   * Get model performance analytics
   */
  getModelAnalytics(hours: number = 24): {
    modelPerformance: ModelMetrics[];
    topPerformers: {
      byCost: ModelMetrics[];
      bySpeed: ModelMetrics[];
      byQuality: ModelMetrics[];
      byReliability: ModelMetrics[];
    };
    usagePatterns: {
      gameTypePreferences: Record<string, Record<string, number>>;
      difficultyPreferences: Record<string, Record<string, number>>;
      tierPreferences: Record<string, Record<string, number>>;
    };
    recommendations: string[];
  } {
    const cutoffTime = new Date(Date.now() - hours * 3600000);
    const recentHistory = this.selectionHistory.filter(h => h.timestamp >= cutoffTime);

    const modelPerformance = Array.from(this.modelMetrics.values());

    // Top performers by different criteria
    const topPerformers = {
      byCost: [...modelPerformance].sort((a, b) => a.averageCost - b.averageCost).slice(0, 3),
      bySpeed: [...modelPerformance].sort((a, b) => a.averageResponseTime - b.averageResponseTime).slice(0, 3),
      byQuality: [...modelPerformance].sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 3),
      byReliability: [...modelPerformance].sort((a, b) => b.successRate - a.successRate).slice(0, 3)
    };

    // Usage patterns
    const usagePatterns = this.analyzeUsagePatterns(recentHistory);

    // Generate recommendations
    const recommendations = this.generateModelRecommendations(modelPerformance, usagePatterns);

    return {
      modelPerformance,
      topPerformers,
      usagePatterns,
      recommendations
    };
  }

  /**
   * Get model recommendations for specific scenarios
   */
  getScenarioRecommendations(): {
    scenarios: Array<{
      name: string;
      description: string;
      recommendedModels: {
        text: string;
        image?: string;
      };
      reasoning: string;
    }>;
  } {
    return {
      scenarios: [
        {
          name: 'Quick Practice Session',
          description: 'Fast, lightweight games for quick learning sessions',
          recommendedModels: {
            text: 'nova-fast',
            image: 'zimage'
          },
          reasoning: 'Optimized for speed and low cost, perfect for frequent short sessions'
        },
        {
          name: 'Comprehensive Learning',
          description: 'High-quality content for in-depth learning',
          recommendedModels: {
            text: 'nova-standard',
            image: 'zimage-hd'
          },
          reasoning: 'Balanced quality and cost for thorough learning experiences'
        },
        {
          name: 'Advanced Practice',
          description: 'Complex scenarios for advanced learners',
          recommendedModels: {
            text: 'nova-premium',
            image: 'zimage-hd'
          },
          reasoning: 'Highest quality models for sophisticated content generation'
        },
        {
          name: 'Budget-Conscious Learning',
          description: 'Cost-effective options for frequent use',
          recommendedModels: {
            text: 'nova-fast',
            image: 'zimage'
          },
          reasoning: 'Most cost-effective models while maintaining acceptable quality'
        },
        {
          name: 'Image-Heavy Games',
          description: 'Games requiring high-quality visual content',
          recommendedModels: {
            text: 'nova-fast',
            image: 'zimage-hd'
          },
          reasoning: 'Fast text generation with high-quality images for visual learning'
        }
      ]
    };
  }

  /**
   * Optimize model selection based on historical performance
   */
  optimizeModelSelection(): {
    optimizations: Array<{
      model: string;
      issue: string;
      recommendation: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    summary: string;
  } {
    const optimizations: Array<{
      model: string;
      issue: string;
      recommendation: string;
      impact: 'high' | 'medium' | 'low';
    }> = [];

    this.modelMetrics.forEach((metrics, model) => {
      // Check for performance issues
      if (metrics.successRate < 0.95) {
        optimizations.push({
          model,
          issue: `Low success rate: ${(metrics.successRate * 100).toFixed(1)}%`,
          recommendation: 'Consider reducing usage or investigating failure causes',
          impact: 'high'
        });
      }

      if (metrics.averageResponseTime > 10000) {
        optimizations.push({
          model,
          issue: `Slow response time: ${metrics.averageResponseTime}ms`,
          recommendation: 'Consider using faster alternatives for time-sensitive operations',
          impact: 'medium'
        });
      }

      if (metrics.averageCost > 0.1) {
        optimizations.push({
          model,
          issue: `High cost per request: $${metrics.averageCost.toFixed(4)}`,
          recommendation: 'Consider using more cost-effective alternatives',
          impact: 'medium'
        });
      }

      if (metrics.usageCount === 0) {
        optimizations.push({
          model,
          issue: 'Model not being used',
          recommendation: 'Evaluate if model should be removed or promoted',
          impact: 'low'
        });
      }
    });

    const summary = optimizations.length > 0
      ? `Found ${optimizations.length} optimization opportunities`
      : 'All models are performing within acceptable parameters';

    return { optimizations, summary };
  }

  /**
   * Calculate model score based on context
   */
  private calculateModelScore(model: any, context: UseCaseContext): number {
    let score = 0;
    const metrics = this.modelMetrics.get(model.name);

    // Base scores from model configuration
    const speedWeight = context.priority === 'speed' ? 0.5 : 0.2;
    const qualityWeight = context.priority === 'quality' ? 0.5 : 0.3;
    const costWeight = context.priority === 'cost' ? 0.5 : 0.3;

    score += model.speedScore * speedWeight;
    score += model.qualityScore * qualityWeight;
    score += (10 - model.costMultiplier * 5) * costWeight; // Invert cost (lower is better)

    // Adjust based on historical performance
    if (metrics) {
      score += metrics.successRate * 20; // Success rate bonus
      score -= Math.min(metrics.averageResponseTime / 1000, 10); // Response time penalty
      score -= Math.min(metrics.averageCost * 100, 10); // Cost penalty
    }

    // Context-specific adjustments
    if (context.userTier === 'free' && model.costMultiplier > 1.5) {
      score -= 20; // Penalty for expensive models for free users
    }

    if (context.difficulty === 'advanced' && model.qualityScore < 8) {
      score -= 15; // Penalty for low-quality models for advanced content
    }

    if (context.gameType === 'image-instinct' && model.name.includes('image')) {
      score += 10; // Bonus for image models in image-heavy games
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get selection reason for a model
   */
  private getSelectionReason(model: any, context: UseCaseContext): string {
    const reasons: string[] = [];

    if (context.priority === 'speed' && model.speedScore >= 8) {
      reasons.push('optimized for speed');
    }

    if (context.priority === 'quality' && model.qualityScore >= 8) {
      reasons.push('high quality output');
    }

    if (context.priority === 'cost' && model.costMultiplier <= 1.2) {
      reasons.push('cost-effective');
    }

    if (context.userTier === 'free') {
      reasons.push('suitable for free tier');
    }

    if (context.difficulty === 'advanced') {
      reasons.push('capable of complex content');
    }

    const metrics = this.modelMetrics.get(model.name);
    if (metrics && metrics.successRate > 0.95) {
      reasons.push('reliable performance');
    }

    return reasons.length > 0 
      ? `Selected for ${reasons.join(', ')}`
      : 'Best overall match for requirements';
  }

  /**
   * Estimate cost for model and context
   */
  private estimateCost(model: any, context: UseCaseContext): number {
    const baseCost = 0.02; // Base cost per request
    let cost = baseCost * model.costMultiplier;

    // Adjust based on context
    if (context.difficulty === 'advanced') {
      cost *= 1.3;
    }

    if (context.contentLength === 'long') {
      cost *= 1.5;
    }

    if (context.imageComplexity === 'detailed') {
      cost *= 2.0;
    }

    return cost;
  }

  /**
   * Get default response time for model
   */
  private getDefaultResponseTime(model: any): number {
    const baseTime = 3000; // 3 seconds base
    return baseTime * (11 - model.speedScore) / 10;
  }

  /**
   * Get available models for content type
   */
  private getAvailableModels(contentType: 'text' | 'image'): any[] {
    const config = costOptimizationService.getModelRecommendation('text', 'cost');
    
    if (contentType === 'text') {
      return [
        { name: 'nova-fast', costMultiplier: 1.0, qualityScore: 7, speedScore: 9 },
        { name: 'nova-standard', costMultiplier: 1.5, qualityScore: 8, speedScore: 6 },
        { name: 'nova-premium', costMultiplier: 2.0, qualityScore: 9, speedScore: 4 }
      ];
    } else {
      return [
        { name: 'zimage', costMultiplier: 1.0, qualityScore: 8, speedScore: 7 },
        { name: 'zimage-hd', costMultiplier: 2.0, qualityScore: 9, speedScore: 5 }
      ];
    }
  }

  /**
   * Update model metrics based on usage
   */
  private updateModelMetric(
    model: string,
    cost: number,
    responseTime: number,
    success: boolean
  ): void {
    const existing = this.modelMetrics.get(model);
    
    if (existing) {
      const totalUsage = existing.usageCount + 1;
      existing.averageCost = (existing.averageCost * existing.usageCount + cost) / totalUsage;
      existing.averageResponseTime = (existing.averageResponseTime * existing.usageCount + responseTime) / totalUsage;
      existing.successRate = (existing.successRate * existing.usageCount + (success ? 1 : 0)) / totalUsage;
      existing.usageCount = totalUsage;
      existing.lastUsed = new Date();
    } else {
      this.modelMetrics.set(model, {
        model,
        averageResponseTime: responseTime,
        successRate: success ? 1 : 0,
        averageCost: cost,
        qualityScore: 7, // Default quality score
        usageCount: 1,
        lastUsed: new Date()
      });
    }
  }

  /**
   * Initialize model metrics with default values
   */
  private initializeModelMetrics(): void {
    const defaultModels = [
      { name: 'nova-fast', quality: 7 },
      { name: 'nova-standard', quality: 8 },
      { name: 'nova-premium', quality: 9 },
      { name: 'zimage', quality: 8 },
      { name: 'zimage-hd', quality: 9 }
    ];

    defaultModels.forEach(model => {
      this.modelMetrics.set(model.name, {
        model: model.name,
        averageResponseTime: 5000,
        successRate: 0.95,
        averageCost: 0.02,
        qualityScore: model.quality,
        usageCount: 0,
        lastUsed: new Date()
      });
    });
  }

  /**
   * Update model metrics from API usage monitor
   */
  private updateModelMetrics(): void {
    const stats = apiUsageMonitor.getStats();
    
    Object.entries(stats.modelUsage).forEach(([model, usage]) => {
      const existing = this.modelMetrics.get(model);
      if (existing && usage.requests > 0) {
        existing.averageCost = usage.cost / usage.requests;
        existing.usageCount = usage.requests;
        existing.lastUsed = new Date();
      }
    });
  }

  /**
   * Analyze usage patterns from history
   */
  private analyzeUsagePatterns(history: any[]): {
    gameTypePreferences: Record<string, Record<string, number>>;
    difficultyPreferences: Record<string, Record<string, number>>;
    tierPreferences: Record<string, Record<string, number>>;
  } {
    const gameTypePreferences: Record<string, Record<string, number>> = {};
    const difficultyPreferences: Record<string, Record<string, number>> = {};
    const tierPreferences: Record<string, Record<string, number>> = {};

    history.forEach(entry => {
      // Game type preferences
      if (!gameTypePreferences[entry.context.gameType]) {
        gameTypePreferences[entry.context.gameType] = {};
      }
      gameTypePreferences[entry.context.gameType][entry.selectedModel] = 
        (gameTypePreferences[entry.context.gameType][entry.selectedModel] || 0) + 1;

      // Difficulty preferences
      if (!difficultyPreferences[entry.context.difficulty]) {
        difficultyPreferences[entry.context.difficulty] = {};
      }
      difficultyPreferences[entry.context.difficulty][entry.selectedModel] = 
        (difficultyPreferences[entry.context.difficulty][entry.selectedModel] || 0) + 1;

      // Tier preferences
      if (!tierPreferences[entry.context.userTier]) {
        tierPreferences[entry.context.userTier] = {};
      }
      tierPreferences[entry.context.userTier][entry.selectedModel] = 
        (tierPreferences[entry.context.userTier][entry.selectedModel] || 0) + 1;
    });

    return { gameTypePreferences, difficultyPreferences, tierPreferences };
  }

  /**
   * Generate model recommendations based on analytics
   */
  private generateModelRecommendations(
    modelPerformance: ModelMetrics[],
    usagePatterns: any
  ): string[] {
    const recommendations: string[] = [];

    // Find underperforming models
    const underperforming = modelPerformance.filter(m => m.successRate < 0.9);
    if (underperforming.length > 0) {
      recommendations.push(`Consider investigating ${underperforming.map(m => m.model).join(', ')} - low success rates detected`);
    }

    // Find unused models
    const unused = modelPerformance.filter(m => m.usageCount === 0);
    if (unused.length > 0) {
      recommendations.push(`Models ${unused.map(m => m.model).join(', ')} are not being used - consider promoting or removing`);
    }

    // Find cost-effective alternatives
    const expensive = modelPerformance.filter(m => m.averageCost > 0.05);
    const cheap = modelPerformance.filter(m => m.averageCost < 0.02 && m.successRate > 0.9);
    if (expensive.length > 0 && cheap.length > 0) {
      recommendations.push(`Consider using ${cheap[0].model} instead of ${expensive[0].model} for cost savings`);
    }

    return recommendations;
  }
}

// Export singleton instance
export const modelSelectionService = new ModelSelectionService();

export default ModelSelectionService;