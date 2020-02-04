import * as mongoose from 'mongoose'

export interface UserInterface extends mongoose.Document {
  email?: string
  mobile?: string
  nid?: string
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 1,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    index: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: 6,
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
  nid: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  nidVerified: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre<UserInterface>('validate', function(next) {
  if (!this.mobile && !this.nid && !this.email) {
    next(new Error('Please enter at least one of the Email Address, Mobile Number, or National ID.'))
  } else {
    next()
  }
})

UserSchema.methods.allVerified = function(): boolean {
  return this.emailVerified && this.mobileVerified && this.nidVerified
}

export default mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema)
