import textModel from '../models/text.model'
import {
  errorResponse,
  getWordsBySentence,
  getWordsByText,
  mostOccurentWords,
} from './helper'

export const fetch = async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  try {
    const texts = await textModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec()

    const docsCount = await textModel.countDocuments()

    return res.status(200).json({
      texts,
      totalPages: Math.ceil(docsCount / limit),
      currentPage: page,
    })
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const create = async (req, res) => {
  try {
    const createdText = await textModel.create({ ...req.body })
    return res.status(201).json(createdText)
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const update = async (req, res) => {
  const { textId } = req.params
  try {
    const updatedText = await textModel.findOneAndUpdate(
      { _id: textId },
      { ...req.body },
      {
        upsert: false,
        new: true,
      },
    )
    if (!updatedText) return res.status(404).send('Not found')
    return res.status(200).json(updatedText)
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const textCount = async (req, res) => {
  const { textId } = req.params
  try {
    const text = await textModel.findById(textId).select('-_id')
    if (!text) return res.status(404).send('Not found')
    const wordsCount = (await getWordsByText(text.toJSON(), true))
      .length
    return res.status(200).json({ wordsCount })
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const textCountByLanguage = async (req, res) => {
  const { textId, language } = req.params
  try {
    const text = await textModel.findById(textId).select('-_id')
    if (!text) return res.status(404).send('Not found')

    const wordsCount = (
      await getWordsBySentence(text[language], true)
    ).length
    return res.status(200).json({ wordsCount })
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const fuzzySearch = async (req, res) => {
  const { q: query } = req.query
  try {
    const texts = await textModel.find({
      $or: [
        { ar: { $regex: `.*${query}.*` } },
        { fr: { $regex: `.*${query}.*` } },
        { en: { $regex: `.*${query}.*` } },
      ],
    })
    return res.status(200).json(texts)
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const mostOccurent = async (req, res) => {
  try {
    const texts = await textModel.find().select('-_id')
    const words = await mostOccurentWords(
      texts.map((text) => text.toJSON()),
    )
    const [mostOccurentWord, ...otherMostOccurentWords] = words
    return res
      .status(200)
      .json({ mostOccurentWord, otherMostOccurentWords })
  } catch (error) {
    return errorResponse(res, error)
  }
}
