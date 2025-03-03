import { NextApiRequest, NextApiResponse } from "next";
import { query } from "src/infra/database";
import { POSTGRES_DB } from "src/infra/envConfig";

const databaseName = POSTGRES_DB;

export default async function Status(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const currentTime = new Date().toISOString();

  const getPostgresVersion = await query({
    queryTextOrConfig: "SHOW server_version;",
  });
  const getMaxConnections = await query({
    queryTextOrConfig: "SHOW max_connections;",
  });
  const getCurrentConnections = await query({
    queryTextOrConfig:
      "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const postgresVersionResult = getPostgresVersion.rows[0].server_version;
  const postgresMaxConnections = parseInt(
    getMaxConnections.rows[0].max_connections,
  );
  const postgresCurrentConnections = getCurrentConnections.rows[0].count;

  res.status(200).json({
    timestamp: currentTime,
    db: {
      version: postgresVersionResult,
      max_connections: postgresMaxConnections,
      current_connections: postgresCurrentConnections,
    },
  });
}
