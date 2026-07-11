import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISchedule extends Document {
  classId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  teacherId: string; // Basé sur le champ teacher de ton IModule
  teacherName: string;
  date: Date;
  day: string; // Ex: "Lundi", "Mardi"
  startTime: string; // Ex: "08:00"
  endTime: string; // Ex: "10:00"
  room: string;
}

const ScheduleSchema = new Schema<ISchedule>({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  date: { type: Date, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true }
}, { timestamps: true });

export default models.Schedule || model<ISchedule>('Schedule', ScheduleSchema);