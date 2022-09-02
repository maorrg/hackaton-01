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
      case "POST":
        const data = req.body.values;
        const section = await prisma.section.findFirst({
          where: {
            courseId: parseInt(data.courseId),
            teachers: {
              some: {
                id: parseInt(data.teacherId),
              },
            },
            users: {
              some: {
                email: session.user.email!,
              },
            },
          },
        });
        const feedback = await prisma.feedback.create({
          data: {
            rating: data.rating.toString(),
            comment: data.comment,
            suggestion: data.suggestion,
            teacherAndSectionOnFeedback: {
              create: {
                teacherId: parseInt(data.teacherId),
                sectionId: section?.id!,
              },
            },
            user: {
              connect: {
                email: session.user.email!,
              },
            },
          },
        });
        return res
          .status(200)
          .json({ message: "Feedback guardado correctamente!" });
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
