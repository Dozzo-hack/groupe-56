// models/Grade.ts
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  value: { type: Number, default: null }, // null si non noté
  status: { type: String, enum: ['brouillon', 'envoyé'], default: 'brouillon' }
}, { timestamps: true });

export const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema);