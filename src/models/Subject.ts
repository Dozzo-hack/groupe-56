import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISubject extends Document {
  name: string;       // Exemple : "Algorithmique Avancée"
  code: string;       // Exemple : "ALGO-AV-3"
  filiere: string;    // Exemple : "Génie Informatique"
  level: number;      // Niveau d'études correspondant (1 à 5)
}

const SubjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  filiere: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

export default models.Subject || model<ISubject>('Subject', SubjectSchema);