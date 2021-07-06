import Joi from '@hapi/joi'
import JoiObjectId from 'joi-objectid'
import loggerService from '../../services/logger.service'

Joi.objectId = JoiObjectId(Joi)
const textValidation = Joi.string()
  .trim()
  .replace(/\s\s+/g, ' ')
  .lowercase()

const stringValidation = Joi.string().required().trim()
const arabicValidation = textValidation.custom((text, helpers) => {
  const pattern = /^[\u0621-\u064A0-9\n,،. ]+$/
  if (!pattern.test(text)) {
    return helpers.message('Invalid arabic text')
  }
  return text
}, 'arabic text validation')
const objectIdValidation = Joi.objectId().required()
const languageValidation = Joi.string()
  .required()
  .valid('en', 'fr', 'ar')

const validationOptions = { abortEarly: false }

const errorResponse = (res, error) => {
  loggerService.serverError(error)
  if (error.isJoi) {
    return res.status(422).json({
      message: 'Validation error',
      error: error.details.map((detail) => detail.message),
    })
  }
  return res.status(500).json({ message: 'Server error' })
}

export const createValidation = async (req, res, next) => {
  try {
    await Joi.object({
      ar: arabicValidation.required(),
      fr: textValidation.required(),
      en: textValidation.required(),
    }).validateAsync(req.body, validationOptions)

    return next()
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const updateValidation = async (req, res, next) => {
  try {
    await Joi.object({ textId: objectIdValidation }).validateAsync(
      req.params,
      validationOptions,
    )
    await Joi.object({
      ar: arabicValidation.allow(null),
      fr: textValidation.allow(null),
      en: textValidation.allow(null),
    }).validateAsync(req.body, validationOptions)
    return next()
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const textCountValidation = async (req, res, next) => {
  try {
    await Joi.object({ textId: objectIdValidation }).validateAsync(
      req.params,
      validationOptions,
    )
    return next()
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const textCountByLanguageValidation = async (
  req,
  res,
  next,
) => {
  try {
    await Joi.object({
      textId: objectIdValidation,
      language: languageValidation,
    }).validateAsync(req.params, validationOptions)
    return next()
  } catch (error) {
    return errorResponse(res, error)
  }
}

export const fuzzySearchValidation = async (req, res, next) => {
  try {
    await Joi.object({ q: stringValidation }).validateAsync(
      req.query,
      validationOptions,
    )
    return next()
  } catch (error) {
    return errorResponse(res, error)
  }
}
