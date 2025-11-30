import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { PracticeSession, IPracticeSession, IPracticeMessage } from '../models/index.js';
import { getPracticeScenarioById, getPracticeScenarioSummary } from '../data/practice.scenarios.js';
import { generateScenarioOpening, generateScenarioTurn, PracticeAIProvider } from '../services/practice.service.js';
import config from '../config/index.js';

function resolveProvider(requested?: PracticeAIProvider): PracticeAIProvider {
  if (requested) {
    if (requested === 'groq' && !config.groq?.apiKey) {
      return 'pollinations';
    }
    return requested;
  }

  return config.groq?.apiKey ? 'groq' : 'pollinations';
}
import { sendError, sendSuccess } from '../utils/response.utils.js';

function serializeSession(session: IPracticeSession) {
  return {
    id: session._id.toString(),
    scenarioId: session.scenarioId,
    scenarioTitle: session.scenarioTitle,
    language: session.language,
    provider: session.provider,
    status: session.status,
    metadata: session.metadata,
    lastInteractionAt: session.lastInteractionAt,
    completedAt: session.completedAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messages: session.messages.map((message: IPracticeMessage) => ({
      id: message._id?.toString() || crypto.randomUUID(),
      role: message.role,
      content: message.content,
      feedback: message.feedback,
      createdAt: message.createdAt,
    })),
  };
}

export const listPracticeScenarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const scenarios = getPracticeScenarioSummary();
    sendSuccess(res, 200, undefined, { scenarios });
  } catch (error) {
    console.error('listPracticeScenarios error:', error);
    sendError(res, 500, 'Unable to load practice scenarios');
  }
};

export const startPracticeSession = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 400, 'Validation failed', errors.array());
    return;
  }

  try {
    const userId = req.user?._id;
    if (!userId) {
      sendError(res, 401, 'User not authenticated');
      return;
    }

    const { scenarioId, provider: requestedProvider } = req.body as { scenarioId: string; provider?: PracticeAIProvider };
    const scenario = getPracticeScenarioById(scenarioId);

    if (!scenario) {
      sendError(res, 404, 'Scenario not found');
      return;
    }

    const provider = resolveProvider(requestedProvider);

    // Reuse active session if it exists
    const activeSession = await PracticeSession.findOne({
      userId,
      scenarioId: scenario.id,
      status: 'active',
    });

    if (activeSession) {
      sendSuccess(res, 200, 'Resuming active session', { session: serializeSession(activeSession) });
      return;
    }

    const sessionSeed = crypto.randomUUID();
    const opening = await generateScenarioOpening({ scenario, sessionSeed, provider });

    const session = await PracticeSession.create({
      userId,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      language: scenario.language,
      provider,
      status: 'active',
      systemPrompt: opening.systemPrompt,
      sessionSeed,
      conversationId: opening.conversationId,
      metadata: {
        difficulty: scenario.difficulty,
        topic: scenario.topic,
      },
      messages: [
        {
          role: 'assistant',
          content: opening.assistantMessage,
          createdAt: new Date(),
        },
      ],
      lastInteractionAt: new Date(),
    });

    sendSuccess(res, 201, 'Practice session created', { session: serializeSession(session) });
  } catch (error) {
    console.error('startPracticeSession error:', error);
    sendError(res, 500, 'Unable to start practice session');
  }
};

export const getPracticeSessionById = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 400, 'Validation failed', errors.array());
    return;
  }

  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;

    if (!userId) {
      sendError(res, 401, 'User not authenticated');
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      sendError(res, 400, 'Invalid session id');
      return;
    }

    const session = await PracticeSession.findOne({ _id: sessionId, userId });
    if (!session) {
      sendError(res, 404, 'Practice session not found');
      return;
    }

    sendSuccess(res, 200, undefined, { session: serializeSession(session) });
  } catch (error) {
    console.error('getPracticeSessionById error:', error);
    sendError(res, 500, 'Unable to load practice session');
  }
};

export const sendPracticeMessage = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 400, 'Validation failed', errors.array());
    return;
  }

  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;
    const { message } = req.body as { message: string };

    if (!userId) {
      sendError(res, 401, 'User not authenticated');
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      sendError(res, 400, 'Invalid session id');
      return;
    }

    const session = await PracticeSession.findOne({ _id: sessionId, userId });

    if (!session) {
      sendError(res, 404, 'Practice session not found');
      return;
    }

    if (session.status !== 'active') {
      sendError(res, 409, 'Practice session is not active. Start a new one to continue.');
      return;
    }

    const scenario = getPracticeScenarioById(session.scenarioId);
    if (!scenario) {
      sendError(res, 410, 'Scenario has been removed');
      return;
    }

    const userMessage: IPracticeMessage = {
      role: 'user',
      content: message,
      createdAt: new Date(),
    };

    const aiResponse = await generateScenarioTurn({
      scenario,
      sessionSeed: session.sessionSeed,
      systemPrompt: session.systemPrompt,
      history: session.messages,
      userMessage: message,
      provider: session.provider,
    });

    session.messages.push(userMessage);
    session.messages.push({
      role: 'assistant',
      content: aiResponse.assistantMessage,
      createdAt: new Date(),
    });
    session.lastInteractionAt = new Date();
    await session.save();

    sendSuccess(res, 200, 'Message processed', {
      session: serializeSession(session),
    });
  } catch (error) {
    console.error('sendPracticeMessage error:', error);
    sendError(res, 500, 'Unable to process message');
  }
};

export const completePracticeSession = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 400, 'Validation failed', errors.array());
    return;
  }

  try {
    const userId = req.user?._id;
    const { sessionId } = req.params;

    if (!userId) {
      sendError(res, 401, 'User not authenticated');
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      sendError(res, 400, 'Invalid session id');
      return;
    }

    const session = await PracticeSession.findOne({ _id: sessionId, userId });

    if (!session) {
      sendError(res, 404, 'Practice session not found');
      return;
    }

    if (session.status === 'completed') {
      sendSuccess(res, 200, 'Practice session already completed', {
        session: serializeSession(session),
      });
      return;
    }

    session.status = 'completed';
    session.completedAt = new Date();
    session.lastInteractionAt = new Date();
    await session.save();

    sendSuccess(res, 200, 'Practice session marked as completed', {
      session: serializeSession(session),
    });
  } catch (error) {
    console.error('completePracticeSession error:', error);
    sendError(res, 500, 'Unable to complete practice session');
  }
};
