export default (sequelize, DataTypes) => {
    return sequelize.define('Carte', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        titlu: {
            type: DataTypes.STRING,
            allowNull: false
        },
        autor: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descriere: {
            type:DataTypes.TEXT,
            allowNull: true
        },
        genLiterar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        caleImagine: {
            type: DataTypes.STRING,
            allowNull: true
        },
        english_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        anger_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },        
        disgust_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },        
        fear_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },        
        joy_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },
        sadness_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },
        surprise_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        },
        neutral_score: {
            type:DataTypes.FLOAT,
            allowNull: true
        }
    }, {
        timestamps: false
    });
};
