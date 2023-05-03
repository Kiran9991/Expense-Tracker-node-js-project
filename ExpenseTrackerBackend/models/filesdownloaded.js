const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const DownloadedFiles = sequelize.define('downloadedFiles', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    fileName: Sequelize.STRING,
    urls: Sequelize.STRING,
  });
  
  module.exports = DownloadedFiles;