const app = require('./src/app');
const { getEnv } = require('./src/config/env');
const logger = require('./src/utils/logger');

const env = getEnv();
const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Database URL configured for Prisma: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});
