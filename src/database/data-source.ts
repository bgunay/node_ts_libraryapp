import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'invent_analytics_user',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'invent_analytics_db',
    logging: ['query'],
    synchronize: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    subscribers: [],
    migrations: [__dirname + 'src/database/migrations/{*.ts,*.js}'],
})
