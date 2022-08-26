import React from "react";
import BackOfficeShell from "../../components/Layout/AppShell/BackOfficeShell";
import { NextPageWithAuth } from "../../types/nextPageAuth";
import { Role } from "../../types/role";
import ViewResults from "../../components/Results/ViewResults";

const Results: NextPageWithAuth = () => {
  return (
    <BackOfficeShell>
      <ViewResults />
    </BackOfficeShell>
  );
};

Results.auth = { role: Role.ADMIN };
export default Results;
