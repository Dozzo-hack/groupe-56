// models/UE.ts
import mongoose from 'mongoose';

const ueSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ex: "UE 1.1 : Bases de l'informatique"
  credits: { type: Number, required: true },
  semesterId: { type: String, required: true }, // ex: "S1"
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
}, { timestamps: true });

export const UE = mongoose.models.UE || mongoose.model('UE', ueSchema);