import React from "react";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";

const Feedback: NextPageWithAuth = () => {
  return (
    <BackOfficeShell>
      <h1>Feedback</h1>
    </BackOfficeShell>
  );
};

Feedback.auth = { role: Role.ADMIN };
export default Feedback;
