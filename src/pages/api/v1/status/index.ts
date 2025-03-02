// create a next api route function that return a json object with the status of the server
import { NextApiRequest, NextApiResponse } from "next";

export default function Status(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
}
