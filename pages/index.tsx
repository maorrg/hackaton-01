import type { NextPage, NextPageContext } from "next";
import {
  Container,
  Button,
  Group,
  LoadingOverlay,
  Text,
  Title,
  Box,
} from "@mantine/core";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import BackOfficeShell from "../components/Layout/AppShell/BackOfficeShell";
import { Role } from "../types/role";
import LoginForm from "../components/Login/LoginForm";
import axios from "axios";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    axios.get(`/api/user`).then(async (res) => {
      const user = res.data;
      if (user.userSecurityValidation === null) {
        router.replace("/security-settings");
      }
    });
  }, []);

  if (session) {
    return (
      <>
        <BackOfficeShell>
          <Title order={2}>
            Hola, {session?.user?.name}
            {"  👋"}
            <br />
          </Title>
        </BackOfficeShell>
      </>
    );
  } else {
    return (
      <Box sx={{ maxWidth: 600, margin: 50 }} mx="auto">
        <LoginForm />
      </Box>
    );
  }
};

Home.auth = { role: Role.STUDENT || Role.TEACHER || Role.ADMIN };
export default Home;
