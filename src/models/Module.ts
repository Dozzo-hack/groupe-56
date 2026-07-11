import mongoose, { Schema, models, model, Document, Model } from 'mongoose';
import './Class';
import './Subject';

export interface IResource {
  title: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface IModule extends Document {
  class: mongoose.Types.ObjectId;
  classCode: string; // 🚀 Lien direct et performant pour filtrer par classe côté étudiant
  subject: mongoose.Types.ObjectId;
  code: string;
  teacher: string;
  teacherName: string;
  level: number;
  title: string;
  colorAccent: string;
  resources: IResource[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  classCode: { type: String, required: true, index: true }, // Indexé pour maximiser la vitesse de lecture
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  code: { type: String, required: true },
  teacher: { type: String, required: true, index: true },
  teacherName: { type: String, required: true },
  level: { type: Number, required: true },
  title: { type: String, required: true },
  colorAccent: { type: String, default: 'blue' },
  resources: {
    type: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  }
}, { timestamps: true });

const Module: Model<IModule> = models.Module || model<IModule>('Module', ModuleSchema);
export default Module;