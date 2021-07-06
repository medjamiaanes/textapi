/* eslint-disable no-undef */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/server'
import textModel from '../src/api/models/text.model'

chai.use(chaiHttp)

const textData = {
  ar: 'هذا نص عربي',
  en: 'This is an english text',
  fr: 'Ceci est un texte français',
}
let textId = ''

describe('textapi testing ...', () => {
  before((done) => {
    textModel.deleteMany({}, () => done())
  })
  describe('Fetch texts', () => {
    it('It should return all texts with pagination', (done) => {
      chai
        .request(server)
        .get('/text')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.keys([
            'texts',
            'currentPage',
            'totalPages',
          ])
          done()
        })
    })
  })

  describe('Create text', () => {
    it('It should create a text and returns it', (done) => {
      chai
        .request(server)
        .post('/text')
        .send(textData)
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body).to.have.keys(['_id', 'ar', 'fr', 'en'])
          textId = res.body._id
          done()
        })
    })
  })

  describe('Update text', () => {
    it('It should update a text', (done) => {
      chai
        .request(server)
        .put(`/text/${textId}`)
        .send(textData)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          done()
        })
    })
  })

  describe('Get word count by text', () => {
    it('It should return wordsCount for a given text', (done) => {
      chai
        .request(server)
        .get(`/text/${textId}/count`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.key('wordsCount')
          done()
        })
    })
  })

  describe('Get word count by text & language', () => {
    it('It should return wordsCount for a given text & language', (done) => {
      chai
        .request(server)
        .get(`/text/${textId}/count/en`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.key('wordsCount')
          done()
        })
    })
  })

  describe('Fuzzy search', () => {
    it('It should return the most occurent word & an array of other words with the same number of occurence', (done) => {
      chai
        .request(server)
        .get('/text/search')
        .query({ q: 'arabic' })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })
  })

  describe('Get the most occurent word', () => {
    it('It should return the most occurent word & an array of any other words with the same occurence', (done) => {
      chai
        .request(server)
        .get('/text/mostOccurent')
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body).to.have.keys([
            'mostOccurentWord',
            'otherMostOccurentWords',
          ])
          done()
        })
    })
  })
})
