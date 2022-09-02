import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

// GET /api/get
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
        const user = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            email: true,
            userSecurityValidation: {
              select: {
                id: true,
              },
            },
          },
        });
        return res.status(200).json(user);
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
