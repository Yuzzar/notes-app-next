const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  database: 'note_dibimbing',
  username: 'note_user',
  password: '1234', 
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();


const Note = require('./note')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  Note,
};
