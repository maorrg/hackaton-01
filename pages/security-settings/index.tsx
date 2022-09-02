import React from "react";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";
import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetCurrentRoute } from "../../components/Layout/AppShell/_mainLinks";
import { Unauthorized } from "../../components/Unauthorized";
import SecurityQuestion from "../../components/Security/SecurityQuestion";

const Security: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <BackOfficeShell>
      <SecurityQuestion />
    </BackOfficeShell>
  );
};

Security.auth = {
  role: Role.ADMIN || Role.STUDENT,
  loading: <LoadingOverlay visible={true} />,
  unauthorized: "/",
};

export default Security;
