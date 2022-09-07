import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

const diffBetweenToHours = (dt1: Date, dt2: Date) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

const securityValidation = async (
  userEmail: string,
  securityQuestionId: number,
  answer: string
): Promise<boolean> => {
  var bcrypt = require("bcryptjs");
  try {
    const userSecurityValidation =
      await prisma.userSecurityValidation.findUnique({
        where: {
          userEmail: userEmail,
        },
        select: {
          securityQuestionId: true,
          answer: true,
        },
      });
    if (
      userSecurityValidation?.securityQuestionId === securityQuestionId &&
      bcrypt.compareSync(answer, userSecurityValidation.answer)
    )
      return true;
  } catch (err) {
    return false;
  }
  return false;
};

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
        const securityQuestionId = data.securityQuestionId;
        const answer = data.answer;
        // Security validation
        if (
          !(await securityValidation(
            session.user.email!,
            securityQuestionId,
            answer
          ))
        ) {
          return res.status(401).json({ message: "Credenciales incorrectas!" });
        }
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
        const lastUserFeedbackOnTeacherSection =
          await prisma.feedback.findFirst({
            where: {
              userEmail: session.user.email!,
              teacherAndSectionOnFeedback: {
                teacherId: parseInt(data.teacherId),
                sectionId: section?.id,
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          });
        const currentDate = new Date();
        if (lastUserFeedbackOnTeacherSection) {
          const timeElapsed = diffBetweenToHours(
            currentDate,
            lastUserFeedbackOnTeacherSection?.createdAt!
          );
          if (timeElapsed < 23) {
            return res.status(429).json({
              message: `¡No han pasado 24 horas desde el último feedback dado a este curso y profesor! Espera ${
                24 - timeElapsed
              } horas para volver a completar este feedback.`,
              timeElapsed: timeElapsed,
              lastFeedbackDate: lastUserFeedbackOnTeacherSection?.createdAt!,
              currentFeedbackDate: currentDate,
            });
          }
        }
        const feedback = await prisma.feedback.create({
          data: {
            rating: data.rating,
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
          .json({ message: "¡Feedback guardado correctamente!" });
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
