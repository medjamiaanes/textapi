/* eslint-disable no-undef */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../src/server'

chai.use(chaiHttp)

describe('textapi', () => {
  describe('Fetch texts', () => {
    it('Should get all texts with pagination', (done) => {
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
      const text = {
        ar: 'هذا نص عربي',
        en: 'Text in english',
        fr: 'Un text en français',
      }
      chai
        .request(server)
        .post('/text')
        .send(text)
        .end((err, res) => {
          expect(res).satisfy(
            ({ status, body }) =>
              (status === 201 && body._id && body.translation) ||
              status === 422,
          )
          done()
        })
    })
  })

  describe('Update text', () => {
    it('It should update a text and returns it or 404 not found', (done) => {
      const text = {
        ar: 'هذا نص عربي',
        en: 'Text in english',
        fr: 'Un text en français',
      }
      chai
        .request(server)
        .put('/text/60e39388c78d014174151ea5')
        .send(text)
        .end((err, res) => {
          expect(res).satisfy(
            ({ status }) =>
              status === 200 || status === 404 || status === 422,
          )
          done()
        })
    })
  })

  describe('Get word count by text', () => {
    it('It should returns wordsCount or 404 not found', (done) => {
      chai
        .request(server)
        .get('/text/60e39388c78d014174151ea2/count')
        .end((err, res) => {
          expect(res.status).satisfy((status) =>
            [200, 404, 422].includes(status),
          )
          expect(res).satisfy(
            ({ status, body }) =>
              (status === 200 && 'wordsCount' in body) ||
              status === 404 ||
              status === 422,
          )
          done()
        })
    })
  })

  describe('Get word count by text & language', () => {
    it('It should returns wordsCount or 404 not found', (done) => {
      chai
        .request(server)
        .get('/text/60e39388c78d014174151ea2/count/en')
        .end((err, res) => {
          expect(res.status).satisfy((status) =>
            [200, 404, 422].includes(status),
          )
          expect(res).satisfy(
            ({ status, body }) =>
              (status === 200 && 'wordsCount' in body) ||
              status === 404 ||
              status === 422,
          )
          done()
        })
    })
  })

  describe('Text fuzzy search', () => {
    it('It should returns an array of texts', (done) => {
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

  describe('Get the most occurent words', () => {
    it('It should returns and array of the most occurent words', (done) => {
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
