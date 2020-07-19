module.exports = (sequelize, DataTypes) => {

    return sequelize.define('film', {
    
        id_film: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        titre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resum: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_debut_affiche: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_fin_affiche: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duree_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        annee_production: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

    }, {
        timestamps: false,
    });

}