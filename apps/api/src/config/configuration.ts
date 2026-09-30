export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'HBridge',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.API_PORT ?? '3001', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'a3f09ebed152f816fe6c2a6e521a97bc9398f8f0abcba942b3d1c39b8593804a',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '7bc7329027e6f5eb2a4f975c6c603cb15dd644d9c7e3734e3aaf5a96a69d0969',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    tempSecret: process.env.JWT_TEMP_SECRET ?? 'dev-temp-secret',
    tempExpiresIn: process.env.JWT_TEMP_EXPIRES_IN ?? '10m',
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
    username: process.env.AT_USERNAME ?? 'sandbox',
    apiKey: process.env.AT_API_KEY,
    senderId: process.env.AT_SENDER_ID ?? 'HBRIDGE',
  },
  otp: {
    hmacSecret: process.env.OTP_HMAC_SECRET,
    ttl: parseInt(process.env.OTP_TTL ?? '300', 10), // 5 minutes
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS ?? '3', 10),
    length: parseInt(process.env.OTP_LENGTH ?? '6', 10),
  },
});