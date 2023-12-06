export const projectConfig = {
    app: {
        port: parseInt(process.env.PORT) || 3001,
    },
    db: {
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017/restaurant'
    },
    jwt: {
        key: process.env.JWT_SECRET_KEY || 'secret',
        expire: process.env.JWT_COOKIE_EXPIRES_IN || '30d'
    },
};