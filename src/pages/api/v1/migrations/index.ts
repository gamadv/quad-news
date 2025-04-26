import { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { RunnerOption } from "node-pg-migrate";
import { join, resolve } from "node:path";
import database from "src/infra/database";
import { isProdEnv } from "src/infra/envConfig";

export default async function migrations(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const dbClient = await database.getNewClient();

  const parsePathAccordingEnv = () => {
    if (isProdEnv) {
      return resolve("src", "infra", "migrations");
    }

    return join("src", "infra", "migrations");
  };

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
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
