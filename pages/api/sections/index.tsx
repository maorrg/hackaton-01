import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

const makeSectionsSelectable = (sections: any) => {
  const response: any = {};
  response["courses"] = [];
  response["teachers"] = {};
  sections.forEach((section: any) => {
    response["courses"].push({
      value: section.course.id.toString(),
      label: section.course.name,
    });
    const courseTeachers: any = [];
    section.teachers.forEach((teacher: any) => {
      courseTeachers.push({
        value: teacher.id.toString(),
        label: `${teacher.name} ${teacher.lastname}`,
      });
    });
    response["teachers"][`${section.course.id}`] = courseTeachers;
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
        const data: any = await prisma.user.findUnique({
          where: {
            email: session.user.email!,
          },
          select: {
            sections: {
              select: {
                course: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                teachers: {
                  select: {
                    id: true,
                    name: true,
                    lastname: true,
                  },
                },
              },
            },
          },
        });
        const response = makeSectionsSelectable(data.sections);
        return res.status(200).json(response);
      default:
        return res.status(401).send({ message: "Unauthorized Method" });
    }
  } else {
    return res
      .status(401)
      .send({ message: "Unauthorized Access. Please Login." });
  }
}
