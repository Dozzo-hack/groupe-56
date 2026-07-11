import mongoose from 'mongoose';

const ProgressionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  viewedResources: [{ type: mongoose.Schema.Types.ObjectId }] // IDs des ressources cliquées
}, { timestamps: true });

export default mongoose.models.Progression || mongoose.model('Progression', ProgressionSchema);