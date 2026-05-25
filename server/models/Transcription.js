import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    transcription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Transcription = mongoose.model('Transcription', transcriptionSchema);

export default Transcription;
