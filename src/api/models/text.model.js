import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    ar: { type: String, required: true },
    fr: { type: String, required: true },
    en: { type: String, required: true },
  },
  { versionKey: false },
)

export default mongoose.model('Text', schema)
