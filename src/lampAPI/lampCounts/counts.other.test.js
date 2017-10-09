process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const name = 'counts'
const route = '/apis'

const REAL_ID = 'TEST01'
const HASH_ID = '9b3814'
const WRONG_HASH_ID = 'eee'

describe(`counts Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  describe(`/Get ${name} Should success-- `, () => {
    it(`should return ${name} With formatBy=date`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=date`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
    it(`should return ${name} With formatBy=hour&lampID=realID`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=hour&lampID=${HASH_ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
    it(`should return sum of all lamp ${name} With formatBy=hour & no lampID`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=hour`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
    it(`should return one lamp ${name} With formatBy=date & real lampID`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=date&lampID=${REAL_ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
    it(`should return one lamp ${name} With formatBy=date & real lampID & limit date`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=date&lampID=${REAL_ID}&limit=7`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })

  describe(`/Get ${name} format By Wrong info Should Not success-- `, () => {
    it(`should Not return ${name} With formatBy=hour & Wrong lampID`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=hour&lampID=${WRONG_HASH_ID}`)
        .end((err, res) => {
          if (err) {
            res.should.have.status(404)
            res.should.be.json
            res.body.should.have.property('error')
            done()
          }
        })
    })
    it(`should Not return ${name} With formatBy=wrong`, (done) => {
      agent
        .get(`${route}/${name}?formatBy=wrong`)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('error')
            done()
          }
        })
    })
  })
})