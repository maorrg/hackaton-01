import React from "react";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";
import ViewResults from "../../components/Results/ViewResults";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";

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
