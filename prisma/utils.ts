import { Session } from "next-auth";
import prisma from "../utils/prisma";

export const getUser = async (session: Session) => {
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
  return user;
};
