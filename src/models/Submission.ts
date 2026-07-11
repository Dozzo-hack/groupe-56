import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISubmission extends Document {
  student: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  assignmentId?: mongoose.Types.ObjectId | null; // 💡 Optionnel pour autoriser le dépôt libre
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student', // Modifie par 'Student' si ton modèle s'appelle différemment
      required: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: false, // 🎯 LA CORRECTION CRITIQUE : required passe à false !
      default: null,   // Si aucun devoir n'est lié, on met null par défaut
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true // Gère automatiquement le 'createdAt' et 'updatedAt'
  }
);

// Sécurité Next.js pour éviter de recompiler le modèle à chaque rechargement à chaud (Hot Reload)
const Submission = models.Submission || model<ISubmission>('Submission', SubmissionSchema);

export default Submission;