import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IClass extends Document {
  name: string;       // Exemple complet : "L3-GI-FA-B"
  regime: 'FI' | 'FA';
  level: number;      // 1 = Niveau 1, 3 = Licence/Niveau 3, 5 = Master 2
  filiere: string;    // Exemple : "Génie Informatique"
  group: string;      // Exemple : "A", "B", "C"
  classroom: string;  // Exemple : "Amphi 200", "Labo S-102"
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true },
  regime: { type: String, enum: ['FI', 'FA'], required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
  filiere: { type: String, required: true },
  group: { type: String, required: true, uppercase: true },
  classroom: { type: String, required: true }
}, { timestamps: true });

export default models.Class || model<IClass>('Class', ClassSchema);