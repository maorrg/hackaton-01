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
        if (
          session.user.role === Role.ADMIN ||
          session.user.role === Role.TEACHER
        ) {
          const results =
            await prisma.$queryRaw`SELECT s."courseId", c."name", AVG(f."rating") as ratingAVG FROM "TeacherAndSectionOnFeedback" AS t JOIN "Feedback" as f ON t."feedbackId" = f."id" JOIN "Section" AS s ON s."id" = t."sectionId" JOIN "Course" as c ON c."id" = s."courseId" GROUP BY s."courseId", c."name";`;
          return res.status(200).json(results);
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
