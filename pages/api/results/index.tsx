// POST /api/post
// Required fields in body: title

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Role } from "../../../types/role";
import prisma from "../../../utils/prisma";

// Optional fields in body: content
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "GET":
        if (session.user.role === (Role.TEACHER || Role.ADMIN)) {
          const results = await prisma.feedback.aggregate({
            _avg: {
              rating: true,
            },
            where: {

            }
          });
        //   return res.status(200).json(response);
        }
        return res.status(401).send({ message: "Unauthorized Method" });
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}