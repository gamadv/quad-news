import { join, resolve } from "node:path";

import controller from "infra/controller";
import database from "infra/database";
import { isProdEnv } from "infra/envConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { runner, RunnerOption } from "node-pg-migrate";
const nextConRouter = createRouter<NextApiRequest, NextApiResponse>();

nextConRouter.get(getHandler);
nextConRouter.post(postHandler);

export default nextConRouter.handler(controller.errorHandlers);

const defaultMigrationOptions: Omit<RunnerOption, "dbClient"> = {
  dir: isProdEnv ? resolve("infra", "migrations") : join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(_: NextApiRequest, response: NextApiResponse) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(_: NextApiRequest, response: NextApiResponse) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
