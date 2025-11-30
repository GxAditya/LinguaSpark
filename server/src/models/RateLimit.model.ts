import mongoose, { Document, Schema } from 'mongoose';

export interface IRateLimitEntry extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  count: number;
  windowStart: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rateLimitSchema = new Schema<IRateLimitEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    windowStart: {
      type: Date,
      required: true,
      index: { expires: 3600 }, // TTL index - auto delete after 1 hour
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
rateLimitSchema.index({ userId: 1, action: 1, windowStart: 1 });

export const RateLimit = mongoose.model<IRateLimitEntry>('RateLimit', rateLimitSchema);
