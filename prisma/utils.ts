import { Session } from "next-auth";
import prisma from "../utils/prisma";
import { ICourseFeedback } from "../utils/types";

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

export const getCourseFeedbackById = async (
  courseId: number,
  session: Session
) => {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      teacher: true,
    },
  });
  const feedback = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      sections: {
        select: {
          teacherAndSectionOnFeedback: {
            select: {
              teacher: {
                select: {
                  name: true,
                  lastname: true,
                },
              },
              feedback: {
                select: {
                  rating: true,
                  comment: true,
                  suggestion: true,
                },
              },
            },
          },
        },
      },
    },
  });
  let courseFeedback: ICourseFeedback[] = [];
  feedback?.sections.forEach((section) => {
    section.teacherAndSectionOnFeedback.forEach((tasof) => {
      courseFeedback.push({
        teacherName: `${tasof.teacher.name} ${tasof.teacher.lastname}`,
        rating: tasof.feedback.rating,
        comment: tasof.feedback.comment,
        suggestion: tasof.feedback.suggestion,
      });
    });
  });
  return courseFeedback;
};

export const getCourseFeedbackByIdForTeacherId = async (
  courseId: number,
  session: Session
) => {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true,
      teacher: true,
    },
  });
  const feedback = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      sections: {
        select: {
          teacherAndSectionOnFeedback: {
            where: {
              teacherId: user?.teacher?.id,
            },
            select: {
              teacher: {
                select: {
                  name: true,
                  lastname: true,
                },
              },
              feedback: {
                select: {
                  rating: true,
                  comment: true,
                  suggestion: true,
                },
              },
            },
          },
        },
      },
    },
  });
  let courseFeedback: ICourseFeedback[] = [];
  feedback?.sections.forEach((section) => {
    section.teacherAndSectionOnFeedback.forEach((tasof) => {
      courseFeedback.push({
        teacherName: `${tasof.teacher.name} ${tasof.teacher.lastname}`,
        rating: tasof.feedback.rating,
        comment: tasof.feedback.comment,
        suggestion: tasof.feedback.suggestion,
      });
    });
  });
  return courseFeedback;
};
