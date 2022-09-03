import React from "react";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";
import ViewResults from "../../components/Results/ViewResults";
import { LoadingOverlay } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import axios from "axios";
import { NextPageContext } from "next";
import { getUser } from "../../prisma/utils";

const Results: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return GetCurrentRoute(router.pathname).role.includes(session?.user.role) ? (
    <BackOfficeShell>
      <ViewResults />
    </BackOfficeShell>
  ) : (
    <Unauthorized user={session!.user} />
  );
};

Results.auth = {
  role: Role.ADMIN,
  loading: <LoadingOverlay visible={true} />,
  unauthorized: "/",
};

export default Results;

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
