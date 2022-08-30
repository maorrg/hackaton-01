import React from "react";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
} from "@mantine/core";
import { GoogleButton } from "../SocialButtons/SocialButtons";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";

const LoginForm = (props: any) => {
  const router = useRouter();

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Bienvenido a FeedMe
      </Text>

      <Group
        grow
        mb="md"
        mt="md"
        onClick={() =>
          signIn("google", { callbackUrl: `${window.location.origin}` })
        }
      >
        <GoogleButton radius="xl">Google</GoogleButton>
      </Group>
    </Paper>
  );
};
export default LoginForm;
