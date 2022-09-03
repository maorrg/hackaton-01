import { LoadingOverlay } from "@mantine/core";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import ViewFeedback from "../../components/Feedback/ViewFeedback";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import { getUser } from "../../prisma/utils";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";

const Feedback: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return GetCurrentRoute(router.pathname).role.includes(session?.user.role) ? (
    <BackOfficeShell>
      <ViewFeedback />
    </BackOfficeShell>
  ) : (
    <Unauthorized user={session!.user} />
  );
};

Feedback.auth = {
  role: Role.ADMIN,
  loading: <LoadingOverlay visible={true} />,
  unauthorized: "/",
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (session) {
    const user = await getUser(session);
    if (user?.userSecurityValidation === null) {
      return {
        redirect: {
          destination: "/security-settings",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Feedback;
