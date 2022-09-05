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

export const getCourseNameById = async (courseId: number) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      name: true,
    },
  });
  return course?.name;
};

export const getCourseFeedbackById = async (courseId: number) => {
  /* 
  {
    professorName,
    rating,
    comment,
    suggestion,
  }

  for (section in sections) {
    for (tasof in section.teacherAndSectionOnFeedback) {
      for (feedback in tasof.feedback) {
        // extraer rating, comment y suggestion
      }
    }
  }
  */
};
