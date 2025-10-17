import controller from "infra/controller";
import migrator from "models/migrator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
const nextConRouter = createRouter<NextApiRequest, NextApiResponse>();

nextConRouter.get(getHandler);
nextConRouter.post(postHandler);

export default nextConRouter.handler(controller.errorHandlers);

async function getHandler(_: NextApiRequest, response: NextApiResponse) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(_: NextApiRequest, response: NextApiResponse) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
