import asyncForeach from 'async-await-foreach'
import loggerService from '../../services/logger.service'

export const errorResponse = (res, error) => {
  loggerService.serverError(error)
  return res.status(500).json({ message: 'server error' })
}

// returns the total count of words of a given sentence
export const wordsCountBySentence = (sentence) =>
  sentence.split(' ').length

// returns the total count of words of a given text object
export const wordsCountByText = async (text) => {
  try {
    let count = 0
    await asyncForeach(Object.keys(text), (key) => {
      count += wordsCountBySentence(text[key])
    })
    return Promise.resolve(count)
  } catch (error) {
    return Promise.reject(error)
  }
}

// returns the total count of words for a given array of texts
export const wordsCount = async (texts) => {
  try {
    let count = 0
    await asyncForeach(texts, async (text) => {
      count += await wordsCountByText(text)
    })
    return Promise.resolve(count)
  } catch (error) {
    return Promise.reject(error)
  }
}

// returns count of a given word occurences for a given sentence
export const wordOccurenceBySentence = async (
  sentence,
  inputWord,
) => {
  try {
    let count = 0
    await asyncForeach(sentence.split(' '), (word) => {
      count += word === inputWord ? 1 : 0
    })
    return Promise.resolve(count)
  } catch (error) {
    return Promise.reject(error)
  }
}

// returns count of a given word occurences for a given text object
export const wordOccurenceByText = async (text, inputWord) => {
  try {
    let count = 0
    await asyncForeach(Object.keys(text), async (key) => {
      count += await wordOccurenceBySentence(text[key], inputWord)
    })
    return Promise.resolve(count)
  } catch (error) {
    return Promise.reject(error)
  }
}

// returns an array of all words of a given sentence
export const getWordsBySentence = async (
  sentence,
  allowOccurence,
) => {
  try {
    const words = []
    await asyncForeach(sentence.split(' '), async (word) => {
      if (!allowOccurence) {
        if (!words.includes(word)) {
          return words.push(word)
        }
      }
      return words.push(word)
    })

    return Promise.resolve(words)
  } catch (error) {
    return Promise.resolve(error)
  }
}

// returns an array of all words of a given text object
export const getWordsByText = async (
  text,
  allowOccurence = false,
) => {
  try {
    let words = []
    await asyncForeach(Object.keys(text), async (key, index) => {
      if (index === 0) {
        words = text[key].split(' ')
      } else {
        await asyncForeach(text[key].split(' '), (word) => {
          if (!allowOccurence) {
            if (!words.includes(word)) {
              words.push(word)
            }
          } else {
            words.push(word)
          }
        })
      }
    })
    return Promise.resolve(words)
  } catch (error) {
    return Promise.resolve(error)
  }
}

// returns the most occurent word of a given array of texts
export const mostOccurentWords = async (texts) => {
  try {
    const words = {}
    await asyncForeach(texts, async (text) => {
      const textWords = await getWordsByText(text)
      await asyncForeach(textWords, async (word) => {
        const occurenceCount = await wordOccurenceByText(text, word)
        words[word] = words[word] ? words[word] + 1 : occurenceCount
      })
    })
    const maxCount = Math.max(...Object.values(words))
    const mostOccurent = Object.keys(words)
      .map((key) => ({
        word: key,
        occurentCount: words[key],
      }))
      .filter(({ occurentCount }) => occurentCount === maxCount)
      .map(({ word }) => word)

    return Promise.resolve(mostOccurent)
  } catch (error) {
    return Promise.reject(error)
  }
}
