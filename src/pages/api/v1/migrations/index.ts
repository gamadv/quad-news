import { isProdEnv } from "infra/envConfig";
import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join, resolve } from "node:path";
import database from "infra/database";

const parsePathAccordingEnv = () => {
  if (isProdEnv) {
    return resolve("infra", "migrations");
  }

  return join("infra", "migrations");
};

export default async function migrations(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method!)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions: RunnerOption = {
      dbClient: dbClient,
      dryRun: true,
      dir: parsePathAccordingEnv(),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error("migrations", error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
