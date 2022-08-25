import type { NextPage, NextPageContext } from "next";
import { Container, Button, Group, LoadingOverlay, Text } from "@mantine/core";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session) {
    return (
      <>
        <h1>Hola @{session.user.name} 🏢</h1>
        {session.user.role === "ADMIN" && <h1>Soy admin</h1>}
        <Group>
          <Button onClick={() => signOut()}>Cerrar Sesión</Button>
        </Group>
      </>
    );
  } else {
    return <h1>Error con la sesión.</h1>;
  }
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Home;
