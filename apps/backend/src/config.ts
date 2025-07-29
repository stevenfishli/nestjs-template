type AppConfig = {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  DB_URL: string;
  MAX_ACCESS_FAILED_COUNT: number;
};

const config: AppConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  DB_URL: process.env.DB_URL || '',
  MAX_ACCESS_FAILED_COUNT: Number(process.env.MAX_ACCESS_FAILED_COUNT) || 5,
};

export default config;
