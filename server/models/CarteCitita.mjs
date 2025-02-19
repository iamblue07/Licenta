export default (sequelize, DataTypes) => {
    return sequelize.define('CarteCitita', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUtilizator: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idCarte: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}