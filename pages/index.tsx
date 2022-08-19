import type { NextPage } from "next";
import { Container, Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <h1>Hola @{session.user.name} 🏢</h1>
        {session.user.role === "ADMIN" && <Text size="xs">Soy admin</Text>}
        <Group>
          <Button onClick={() => signOut()}>Cerrar Sesión</Button>
        </Group>
      </>
    );
  }
  return <h1>No ha iniciado sesión</h1>;
};

export default Home;
