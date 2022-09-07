import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { Role } from "../../types/role";
import {
  Box,
  LoadingOverlay,
  Card,
  Text,
  Badge,
  Group,
  Paper,
  Title,
  Anchor,
  Breadcrumbs,
} from "@mantine/core";
import { NextPageContext } from "next";
import {
  getCourseFeedbackById,
  getCourseFeedbackByIdForTeacherId,
  getCourseNameById,
} from "../../prisma/utils";
import { ICourseFeedback } from "../../utils/types";
import { MdClass } from "react-icons/md";
import { getSession } from "next-auth/react";
import { AiFillStar } from "react-icons/ai";
import { getRatingColor } from "../../utils/styles";

interface Props {
  courseName: string;
  courseFeedbackList: ICourseFeedback[];
}

const CourseResults = (props: Props) => {
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

  const items = [
    { title: "Resultados", href: "/results" },
    { title: props.courseName, href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <BackOfficeShell>
      <Box sx={{ maxWidth: 900 }} mx="auto">
        <Breadcrumbs style={{ marginTop: 10 }} separator="→">
          {items}
        </Breadcrumbs>
        <Group style={{ padding: 15 }}>
          <MdClass size={30} />
          <Title>{props.courseName}</Title>
        </Group>
        <>
          {props.courseFeedbackList.map((feedback, index) => (
            <Card
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              key={index}
              style={{ marginTop: 10 }}
            >
              <Badge size="lg">{feedback.createdAt}</Badge>
              <Group position="apart" mt="md" mb="xs">
                <Title order={3}>{feedback.teacherName}</Title>
                <Badge
                  style={{ width: 80 }}
                  leftSection={<AiFillStar size={12} />}
                  color={getRatingColor(feedback.rating)}
                  size="xl"
                >
                  {feedback.rating}
                </Badge>
              </Group>
              <Paper shadow="xs" p="md" withBorder>
                <Group>
                  <Badge>Comentario</Badge>
                  <Text size="sm" color="dimmed">
                    {feedback.comment}
                  </Text>
                </Group>
              </Paper>
              {feedback.suggestion && (
                <>
                  <Paper shadow="xs" p="md" withBorder style={{ marginTop: 5 }}>
                    <Group>
                      <Badge color="yellow">Sugerencia</Badge>
                      <Text size="sm" color="dimmed">
                        {feedback.suggestion}
                      </Text>
                    </Group>
                  </Paper>
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
  const session = await getSession(context);
  if (typeof courseId === "string") {
    const course = await getCourseNameById(parseInt(courseId));
    if (session?.user.role === "TEACHER") {
      const courseFeedbackList = await getCourseFeedbackByIdForTeacherId(
        parseInt(courseId),
        session!
      );
      return {
        props: { courseName: course, courseFeedbackList: courseFeedbackList },
      };
    }
    if (session?.user.role === "ADMIN") {
      const courseFeedbackList = await getCourseFeedbackById(
        parseInt(courseId),
        session!
      );
      return {
        props: { courseName: course, courseFeedbackList: courseFeedbackList },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/results",
        permanent: false,
      },
    };
  }
}
