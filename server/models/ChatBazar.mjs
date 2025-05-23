export default (sequelize, DataTypes) => {
    return sequelize.define('ChatBazar', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idAnunt: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idVanzator: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idCumparator: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            allowNull:false
        },
        esteDeschis: {
            type: DataTypes.BOOLEAN,
            allowNull:false
        }
    },  {
        timestamps: false
    })
}