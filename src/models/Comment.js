// src/models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  recipe_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  author_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'comments',
  timestamps: true, // createdAt / updatedAt
});

module.exports = Comment;
