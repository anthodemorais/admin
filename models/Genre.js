module.exports = (sequelize, DataTypes) => {

    return sequelize.define('genre', {
    
        id_genre: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: false,
    });

}