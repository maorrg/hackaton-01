import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../../utils/prisma";

const makeQuestionsSelectable = (questionsArray: any) => {
  const response: any = [];
  questionsArray.forEach((question: any) => {
    response.push({ value: question.id, label: question.question });
  });
  return response;
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
      case "GET":
        const questions = await prisma.securityQuestion.findMany({
          select: {
            id: true,
            question: true,
          },
        });
        return res.status(200).json(makeQuestionsSelectable(questions));
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
