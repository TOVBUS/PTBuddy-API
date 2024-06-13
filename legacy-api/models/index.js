// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config.js')[env];
// const db = {};

// const sequelize = new Sequelize(config.database, config.username, config.password, config);

// const Activity = require('./activity');
// db.Activity = Activity;
// Activity.init(sequelize);

// const ActivityRoutine = require('./activityRoutine');
// db.ActivityRoutine = ActivityRoutine;
// ActivityRoutine.init(sequelize);

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
const Sequelize = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config);

const Activity = require('./activity');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Activity = Activity;

Activity.init(sequelize); // 모델 초기화

module.exports = db;
