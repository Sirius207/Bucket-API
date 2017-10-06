// Setup DB Connection Global Variable
global.CONFIG = (process.env.RESET_PROD_DB === 'TRUE')
  ? require('../config/lampProdConfig.js')
  : require('../config/lampDevConfig.js')

const CONFIG = global.CONFIG

global.SEQUELIZE = require('../connection/lampsConnect.js')

// Import Model
const basePath = '../src/lampAPI'
const Places = require(`${basePath}/lampPlaces/placesModel.js`)
const Lamps = require(`${basePath}/lamps/lampsModel.js`)
const Counts = require(`${basePath}/lampCounts/countsModel.js`)
const States = require(`${basePath}/lampStates/statesModel.js`)
const Rules = require(`${basePath}/lampMccRules/rulesModel.js`)
const Mcc = require(`${basePath}/lampMcc/mccModel.js`)
const Comments = require(`${basePath}/lampComments/commentsModel.js`)

// Import user model
const accountsPath = '../src/accounts'
const Permissions = require(`${accountsPath}/permissions/permissionsModel.js`)
const Roles = require(`${accountsPath}/roles/rolesModel.js`)
const Users = require(`${accountsPath}/users/usersModel.js`)
const RolesPermissions = require(`${accountsPath}/rolesPermissions/rolesPermissionsModel.js`)
const UsersRoles = require(`${accountsPath}/usersRoles/usersRolesModel.js`)

// use force_remove = true only in dev db
// default force_remove = false in prod db
const FORCE_REMOVE = CONFIG['force']

const DBInitialize = async (tables) => {
  try {
    for (let table of tables) {
      console.log(table)
      await table.sync(FORCE_REMOVE)
    }
    console.log(`\n\n ${CONFIG['database']} Initialize success \n\n`)
  } catch (error) {
    console.log(`DB Initialize error:\n${error}`)
  }
}

const DataInitialize = async () => {
  try {
    await Places.create({
      place_name: 'Lab',
      place_address: '701台南市東區大學路1號 資訊系館 6樓 101房'
    })

    await Lamps.create({
      lamp_id: 'TEST01',
      lamp_hash_id: '2346',
      lamp_location: [120.19151248216, 22.9997144678771],
      place_id: 1
    })

    await Lamps.create({
      lamp_id: 'TEST02',
      lamp_hash_id: '2345',
      lamp_location: [120.193272644465, 22.9963046536379],
      place_id: 1
    })

    await Counts.create({
      lamp_id: 'TEST01',
      counts: 1
    })

    await Counts.create({
      lamp_id: 'TEST02',
      counts: 1
    })

    await Rules.create({
      timeline_upper_limit: 3,
      distance_lower_limit: 500,
      points_lower_limit: 5,
      counts_lower_limit: 20
    })

    await Mcc.create({
      mcc_keys: ['TEST02', 'TEST01'],
      mcc_points: ['TEST02', 'TEST01'],
      mcc_center: [120.218587, 22.999277],
      rule_id: 1
    })
    console.log(`\n\n ${CONFIG['database']} Initialize Data success \n\n`)
  } catch (error) {
    console.log('DATA: ', error)
  }
}

const initialize = async () => {
  // Initialize Data Tables
  const DATA_TABLES = [Places, Lamps, Counts, States, Rules, Mcc, Comments]
  await DBInitialize(DATA_TABLES)
  await DataInitialize()

  // Initialize Users Tables
  const USER_TABLES = [Permissions, Roles, Users, UsersRoles, RolesPermissions]
  await DBInitialize(USER_TABLES)

  process.exit()
}

initialize()
