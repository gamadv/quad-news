import { Client, QueryConfig } from "pg";
import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  isProdEnv,
} from "./envConfig";

interface QueryProps {
  queryTextOrConfig: string | QueryConfig<any[]>;
  values?: any[] | undefined;
}

async function getNewClient() {
  const client = new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    ssl: isProdEnv,
  });

  await client.connect();
  return client;
}

async function query(props: QueryProps) {
  const { queryTextOrConfig, values } = props;
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryTextOrConfig, values);
    client.end();
    return result;
  } catch (error) {
    console.error("Error on get postgres version", error);
    throw error;
  } finally {
    client = await getNewClient();
    await client.end();
  }
}

export default {
  query,
  getNewClient,
};
