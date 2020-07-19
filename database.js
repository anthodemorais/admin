const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('cinema', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889,
    logging: false
});

const Film = require('./models/Film')(sequelize, DataTypes)
const Genre = require('./models/Genre')(sequelize, DataTypes)
const Distributeur = require('./models/Distributeur')(sequelize, DataTypes)

Genre.hasMany(Film, {
    foreignKey: {
      name: 'id_genre',
      allowNull: true
    }
})
Distributeur.hasOne(Film, {
    foreignKey: {
      name: 'id_distributeur',
      allowNull: true
    }
})

sequelize.sync({
    alter: {
        drop: false
    }
})

module.exports = {
    sequelize: sequelize,
    Film: Film,
    Genre: Genre,
    Distributeur: Distributeur
}