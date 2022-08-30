import type { NextPage, NextPageContext } from "next";
import {
  Container,
  Button,
  Group,
  LoadingOverlay,
  Text,
  Title,
} from "@mantine/core";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackOfficeShell from "../components/Layout/AppShell/BackOfficeShell";
import { Role } from "../types/role";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session) {
    return (
      <>
        {/* <h1>Hola @{session.user.name} 🏢</h1>
        {session.user.role === "ADMIN" && <h1>Soy admin</h1>} */}
        <BackOfficeShell>
          <Title order={2}>
            Hola, {session?.user?.name}
            {"  👋"}
            <br />
          </Title>
        </BackOfficeShell>
        <Group>
          <Button onClick={() => signOut()}>Cerrar Sesión</Button>
        </Group>
      </>
    );
  } else {
    return <h1>Error con la sesión.</h1>;
  }
};

Home.auth = { role: Role.STUDENT || Role.TEACHER|| Role.ADMIN };
export default Home;
