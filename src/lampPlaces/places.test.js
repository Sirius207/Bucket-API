process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const loginAuth = (agent, next) => {
  return agent
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({'email': 'sirius@ccns.ncku.edu.tw', 'password': 'sample1234'})
    .end((err, res) => {
      if (err) next(err)
      agent.get('/login').then((res) => {
        res.should.have.status(200)
        next()
      })
    })
}

describe('Places -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New Place
  // =========================
  describe('/POST Place -- ', () => {
    it('new place data should be create', (done) => {
      const place = {
        place_name: 'NETDB',
        place_address: '70100',
        place_contact_person: '莊先生'
      }
      agent
        .post('/apis/places')
        .send(place)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('place')
          ID = res.body.place.place_id
          done()
        })
    })

    it('new place without place name should NOT be create', (done) => {
      const place = {
        place_address: '70100',
        place_contact_person: '莊先生'
      }
      agent
        .post('/apis/places')
        .send(place)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Place
  // =========================
  describe('/Get All Places -- ', () => {
    it('should return all places', (done) => {
      agent
        .get('/apis/places')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('places')
          done()
        })
    })
  })

  // =========================
  // Get Place By ID
  // =========================
  describe('/Get Place By ID -- ', () => {
    it('should return single place With Correct ID', (done) => {
      agent
        .get(`/apis/places/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('place')
          done()
        })
    })
    it('should Not return single place With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/places/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single place With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/places/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Place
  // =========================
  describe('/Put Place -- ', () => {
    it('place data should be update', (done) => {
      const place = {
        place_name: 'NETDB_2',
        place_address: '70102',
        place_contact_person: 'MR. Yang'
      }
      agent
        .put(`/apis/places/${ID}`)
        .send(place)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('place_id')
          done()
        })
    })
  })

  // =========================
  // Remove A Place
  // =========================
  describe('/Delete Place -- ', () => {
    it('place data should be delete', (done) => {
      agent
        .delete(`/apis/places/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })
})