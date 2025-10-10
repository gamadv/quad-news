import { NextApiRequest, NextApiResponse } from "next";
import db from "infra/database";
import { POSTGRES_DB } from "infra/envConfig";
import { InternalServerError } from "infra/errors";

const databaseName = POSTGRES_DB;

export default async function Status(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const allowedMethods = ["GET"];
  if (!allowedMethods.includes(req.method!)) {
    return res.status(405).json({
      error: `Method "${req.method}" not allowed`,
    });
  }
  const currentTime = new Date().toISOString();

  try {
    const getPostgresVersion = await db.query({
      queryTextOrConfig: "SHOW server_version;",
    });
    const getMaxConnections = await db.query({
      queryTextOrConfig: "SHOW max_connections;",
    });

    const getCurrentConnections = await db.query({
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
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObject);

    res.status(500).json(publicErrorObject);
  }
}
