import type { NextPage } from "next";
import { Container, Button, Group, LoadingOverlay } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <h1>Hola @{session.user.name} 🏢</h1>
        <Group>
          <Button onClick={() => signOut()}>Cerrar Sesión</Button>
        </Group>
      </>
    );
  }
  return <h1>No ha iniciado sesión</h1>;
};

export default Home;
