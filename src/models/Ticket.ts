import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['student', 'admin'], required: true },
  text: { type: String, default: "" },
  fileName: { type: String, default: "" },
  fileUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true }, // Ex: REQ-001
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  attachmentName: { type: String },
  attachmentUrl: { type: String },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  internalNotes: { type: String, default: "" },
  messages: [MessageSchema],
}, { timestamps: true });

// Auto-génération de l'ID (ex: REQ-1A2B)
TicketSchema.pre('save', async function() {
    if (!this.ticketId) {
      const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
      this.ticketId = `REQ-${randomHex.padStart(4, '0')}`;
    }
  });

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);