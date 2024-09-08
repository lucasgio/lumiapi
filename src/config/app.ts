export const app = {
  port: process.env.PORT as unknown as number,
  version: process.env.VERSION || 'v1',
  db: {
    host: process.env.DB_HOST,
  },
}
