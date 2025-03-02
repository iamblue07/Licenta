export default (sequelize, DataTypes) => {
    return sequelize.define('CarteCitita', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUtilizator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Utilizators',
                key: 'id'
            }
        },
        idCarte: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cartes',
                key: 'id'
            }
        },
        imiPlace: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        timestamps: false
    });
};
