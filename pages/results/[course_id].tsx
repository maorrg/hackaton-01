import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import { Role } from "../../types/role";
import { Box, LoadingOverlay } from "@mantine/core";
import { NextPageContext } from "next";
import { getCourseNameById } from "../../prisma/utils";

interface Props {
  courseName: string;
}

const CourseResults = (props: Props) => {
  const router = useRouter();
  const { course_id } = router.query;

  const { data: session, status } = useSession();
  return (
    <BackOfficeShell>
      <Box sx={{ maxWidth: 900 }} mx="auto">
        <h1>Curso: {props.courseName}</h1>
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
    console.log(course);
    return {
      props: { courseName: course },
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
