const POSTGRES_HOST = String(process.env.POSTGRES_HOST);
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
const POSTGRES_USER = String(process.env.POSTGRES_USER);
const POSTGRES_DB = String(process.env.POSTGRES_DB);
const POSTGRES_PASSWORD = String(process.env.POSTGRES_PASSWORD);

export {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
};
