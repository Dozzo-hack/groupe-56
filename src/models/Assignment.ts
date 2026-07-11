import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const AssignmentSchema = new mongoose.Schema({
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  submissions: [SubmissionSchema] // Liste des étudiants ayant rendu le devoir
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);