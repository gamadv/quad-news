import { Client, QueryConfig } from "pg";
import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
} from "./envConfig";

interface QueryProps {
  queryTextOrConfig: string | QueryConfig<any[]>;
  values?: any[] | undefined;
}

export async function query(props: QueryProps) {
  const { queryTextOrConfig, values } = props;
  const client = new Client({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
    const result = await client.query(queryTextOrConfig, values);
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error on get postgres version", error);
    throw error;
  } finally {
    await client.end();
  }
}
