import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Nom requis"] 
  },
  email: { 
    type: String, 
    required: [true, "Email requis"], 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, "Mot de passe requis"] 
  },
  role: { 
    type: String, 
    default: 'teacher' 
  }, // Toujours 'teacher'
  
  departement: { 
    type: String, 
    default: "Informatique" 
  }, // Pour la gestion administrative
  
  modules: [{ 
    type: String 
  }], // Les matières qu'il enseigne (ex: ["Web", "Base de données"])

  // ➕ Nouveaux champs alignés avec le Frontend et l'API Profile :
  phone: { 
    type: String, 
    default: "" 
  },
  
  residence: { 
    type: String, 
    default: "" 
  }, // Lieu de résidence / Adresse
  
  specialization: { 
    type: String, 
    default: "" 
  }, // Spécialité de l'enseignant
  
  avatar: { 
    type: String, 
    default: null 
  }, // URL ou chaîne de caractères de l'image de profil
  
  birthDate: { 
    type: Date 
  }, // Date de naissance

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);