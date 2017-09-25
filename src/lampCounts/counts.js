const { body, param } = require('express-validator/check')
const { sanitize } = require('express-validator/filter')

const { BaseController } = require('../baseController')
const CountsModel = require('./countsModel')

class CountsController extends BaseController {
  constructor (Model, modelName) {
    super(Model, modelName)

    this.ValidateIdParams = [
      param('id', 'id should be a int').custom(id => {
        if (!Number.isInteger(Number(id))) {
          throw new Error('id format illegal')
        }
        return id
      }),
      sanitize('id').toInt()
    ]

    this.ValidateCreateKeys = [
      body('lamp_id', 'lamp_id illegal').exists(),
      body('counts', 'counts illegal').exists()
    ]
  }
}

const modelName = {
  singular: 'count',
  plural: 'counts',
  id: 'count_id'
}

module.exports = new CountsController(CountsModel, modelName)