import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  translation: {
    ar: { type: String, required: true },
    fr: { type: String, required: true },
    en: { type: String, required: true },
  },
})

export default mongoose.model('Text', schema)
