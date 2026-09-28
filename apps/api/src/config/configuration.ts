export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'HBridge',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.API_PORT ?? '3001', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  sms: {
    username: process.env.AT_USERNAME,
    apiKey: process.env.AT_API_KEY,
    senderId: process.env.AT_SENDER_ID ?? 'HBRIDGE',
  },
});