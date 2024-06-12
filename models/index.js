'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 현재 작업 디렉토리를 기준으로 models 디렉토리 경로 설정
const modelsDirectory = path.join(process.cwd(), 'models');

fs
  .readdirSync(modelsDirectory)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(modelsDirectory, file));
    if (typeof model.init === 'function') {
      model.init(sequelize);
    }
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
