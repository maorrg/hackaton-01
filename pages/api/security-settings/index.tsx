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
        const bcrypt = require("bcryptjs");
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.answer, salt);
        try {
          const createUserSecurityValidation =
            await prisma.userSecurityValidation.create({
              data: {
                answer: hash,
                securityQuestionId: data.securityQuestionId,
                userEmail: session.user.email!,
              },
            });
        } catch (err) {
          return res.status(401).json({ message: "Método no permitido." });
        }
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
