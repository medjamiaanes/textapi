import { Router } from 'express'
import * as textHandler from '../handlers/text.handler'
import * as validation from '../middlewares/validation.middleware'

const router = Router()

router
  .route('/')
  .get(textHandler.fetch)
  .post(validation.createValidation, textHandler.create)

router.put(
  '/:textId',
  validation.updateValidation,
  textHandler.update,
)

router.get(
  '/:textId/count',
  validation.textCountValidation,
  textHandler.textCount,
)

router.get(
  '/:textId/count/:language',
  validation.textCountByLanguageValidation,
  textHandler.textCountByLanguage,
)

router.get(
  '/search',
  validation.fuzzySearchValidation,
  textHandler.fuzzySearch,
)

router.get('/mostOccurent', textHandler.mostOccurent)

export default router
