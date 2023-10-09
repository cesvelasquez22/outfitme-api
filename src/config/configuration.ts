export default () => ({
  production: process.env.NODE_ENV === 'production',
  stage: process.env.STAGE || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DB_URL,
  },
});
