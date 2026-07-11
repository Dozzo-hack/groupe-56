import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Nom requis"] },
  email: { type: String, required: [true, "Email requis"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Mot de passe requis"] },
  role: { type: String, default: 'student' },
  matricule: { type: String, unique: true, required: [true, "Matricule requis"] },
  ine: { type: String, unique: true, sparse: true },
  phone: { type: String, default: "" },
  location: { type: String, default: "" }, // Ex: "ANGE RAPHAËL", "BONAMOUSSADI"
  classCode: { type: String, required: [true, "Liaison de classe requise"] }, // Ex: "L1-GI-FI-A" ou "GL-A"
  groupe: { type: String, default: "A" },
  status: { 
    type: String, 
    enum: ['active', 'graduated', 'archived'], 
    default: 'active' 
  },
  academicHistory: [
    {
      classCode: String,
      year: String, // Ex: "2025-2026"
      promotedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);