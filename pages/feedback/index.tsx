import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import ViewFeedback from "../../components/Feedback/ViewFeedback";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";

const Feedback: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return GetCurrentRoute(router.pathname).role.includes(session?.user.role) ? (
    <BackOfficeShell>
      <ViewFeedback/>
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

export default Feedback;
