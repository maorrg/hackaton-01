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
        const data = req.body.formValues;
        const userSecurityValidation =
          await prisma.userSecurityValidation.create({
            data: {
              answer: data.answer,
              securityQuestionId: data.securityQuestionId,
              userEmail: session.user.email!,
            },
          });
        return res
          .status(200)
          .json({ message: "Pregunta de seguridad creada correctamente." });
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
