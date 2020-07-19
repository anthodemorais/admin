module.exports = (sequelize, DataTypes) => {

    return sequelize.define('distributeur', {
    
        id_distributeur: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telephone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cpostal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ville: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pays: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        timestamps: false,
    });

}