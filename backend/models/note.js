const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Note extends Model {
    static associate(models) {
      
    }
  }
  
  Note.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Note',
    tableName: 'Notes',  
    timestamps: true,    
  });

  return Note;
};
