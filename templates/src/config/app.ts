import dotenv from 'dotenv';
dotenv.config();

/**
 * Application configuration object.
 *
 * This object centralizes access to environment variables throughout the application.
 * It sets up default values where environment variables are not provided.
 *
 *
 */
export const app = {
  /**
   * The port on which the application will run.
   * Default is 3000 if the `PORT` environment variable is not defined.
   */
  port: parseInt(process.env.PORT as string) || 3000,

  /**
   * The current version of the application.
   * Default is '1.0.0' if the `VERSION` environment variable is not defined.
   */
  version: process.env.VERSION || '1.0.0',

  /**
   * The version of the API.
   * Default is 'v1' if the `VERSION_API` environment variable is not defined.
   */
  version_api: process.env.VERSION_API || 'v1',

  db: {
    /**
     * The host of the database.
     * This is read from the `DB_HOST` environment variable.
     */
    host: process.env.DB_HOST,
  },
};
