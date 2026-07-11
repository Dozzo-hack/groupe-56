import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Nom requis"] },
  email: { type: String, required: [true, "Email requis"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Mot de passe requis"] },
  role: { type: String, default: 'admin' }, // Toujours admin
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);