import sequelize from 'sequelize'
import { QueryInterface, DataTypes } from 'sequelize'

const tableName = 'categories'

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable(tableName, {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        description: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
    })
}

export async function down(queryInterface: QueryInterface) {
    return queryInterface.dropTable(tableName)
}
