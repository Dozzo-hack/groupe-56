import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId | string;
  studentName: string;
  matricule: string;
  status: 'present' | 'absent';
}

export interface IAttendance extends Document {
  classCode: string;       // ex: "L1-GI-FI-A" (Lien direct avec vos étudiants et classes)
  subjectCode: string;     // ex: "ALGO-AV-3" (Code unique de votre modèle Subject)
  teacherEmail: string;    // Enseignant ayant effectué l'appel
  date: Date;              // Date de la session d'appel
  records: IAttendanceRecord[];
}

const AttendanceSchema = new Schema<IAttendance>({
  classCode: { type: String, required: true, index: true },
  subjectCode: { type: String, required: true, uppercase: true, index: true },
  teacherEmail: { type: String, required: true, lowercase: true },
  date: { type: Date, default: Date.now, index: true },
  records: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    studentName: { type: String, required: true },
    matricule: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
  }]
}, { timestamps: true });

// Index composé pour éviter les doublons d'appel pour une classe, une matière, le même jour (au niveau de l'heure/session)
AttendanceSchema.index({ classCode: 1, subjectCode: 1, date: 1 });

export default models.Attendance || model<IAttendance>('Attendance', AttendanceSchema);