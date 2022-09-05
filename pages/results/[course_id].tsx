import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import { Role } from "../../types/role";
import {
  Box,
  LoadingOverlay,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
} from "@mantine/core";
import { NextPageContext } from "next";
import { getCourseFeedbackById, getCourseNameById } from "../../prisma/utils";
import { ICourseFeedback } from "../../utils/types";

interface Props {
  courseName: string;
  courseFeedbackList: ICourseFeedback[];
}

const CourseResults = (props: Props) => {
  console.log(props.courseFeedbackList);

  const feedbackComponents = props.courseFeedbackList.forEach((feedback) => (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{feedback.teacherName}</Text>
        <Badge color="pink" variant="light">
          {feedback.rating}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {feedback.comment}
      </Text>
      <Text size="sm" color="dimmed">
        {feedback.suggestion}
      </Text>
    </Card>
  ));

  return (
    <BackOfficeShell>
      <Box sx={{ maxWidth: 900 }} mx="auto">
        <h1>Curso: {props.courseName}</h1>
        <>
          {props.courseFeedbackList.map((feedback, index) => (
            <Card shadow="sm" p="lg" radius="md" withBorder key={index}>
              <Group position="apart" mt="md" mb="xs">
                <h3>Profesor: {feedback.teacherName}</h3>
                <Badge color={feedback.rating < 4 ? "red" : "green"} size="xl">
                  {feedback.rating}
                </Badge>
              </Group>
              <h4>Comentario:</h4>
              <Text size="sm" color="dimmed">
                {feedback.comment}
              </Text>
              {feedback.suggestion && (
                <>
                  <h4>Sugerencia:</h4>
                  <Text size="sm" color="dimmed">
                    {feedback.suggestion}
                  </Text>
                </>
              )}
            </Card>
          ))}
        </>
      </Box>
    </BackOfficeShell>
  );
};

CourseResults.auth = {
  role: Role.ADMIN,
  loading: <LoadingOverlay visible={true} />,
  unauthorized: "/",
};

export default CourseResults;

export async function getServerSideProps(context: NextPageContext) {
  const courseId = context.query.course_id;
  if (typeof courseId === "string") {
    const course = await getCourseNameById(parseInt(courseId));
    const courseFeedbackList = await getCourseFeedbackById(parseInt(courseId));
    return {
      props: { courseName: course, courseFeedbackList: courseFeedbackList },
    };
  } else {
    return {
      redirect: {
        destination: "/results",
        permanent: false,
      },
    };
  }
}
