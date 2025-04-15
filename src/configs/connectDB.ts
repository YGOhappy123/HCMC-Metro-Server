import { Sequelize } from 'sequelize-typescript'

const sequelizeIns = new Sequelize({
    dialect: 'mysql',
    host: process.env.SQL_HOST || 'localhost',
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE_NAME,
    pool: {
        max: 10,
        min: 0,
        acquire: 60000,
        idle: 60000
    },
    dialectOptions: {
        connectTimeout: 60000,
        dateStrings: true,
        typeCast: true
    },
    logging: false,
    models: [__dirname + '/../models']
})

export default sequelizeIns
