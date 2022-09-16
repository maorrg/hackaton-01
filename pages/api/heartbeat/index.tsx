import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "GET":
        const requestInDateTime = Date();
        const startTime = performance.now();
        const tryDatabase = await prisma.user.findMany();
        const endTime = performance.now()
        return res
          .status(200)
          .json({ message: "Estoy vivo <3", dbResponseTime: `${(endTime - startTime).toFixed(2)} milliseconds`, requestDateTime: requestInDateTime.toString()});
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
