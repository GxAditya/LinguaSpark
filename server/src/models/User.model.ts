import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  
  // Learning progress
  currentLanguage: string;
  targetLanguages: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  streak: number;
  lastActiveDate: Date;
  
  // Settings
  dailyGoal: number; // minutes per day
  notificationsEnabled: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  // Static methods can be added here
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    
    // Learning progress
    currentLanguage: {
      type: String,
      default: 'spanish',
    },
    targetLanguages: {
      type: [String],
      default: ['spanish'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    
    // Settings
    dailyGoal: {
      type: Number,
      default: 15, // 15 minutes per day
      min: 5,
      max: 120,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output (remove password from JSON)
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, __v, ...rest } = ret;
    return rest;
  },
});

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
