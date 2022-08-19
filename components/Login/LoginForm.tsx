import React from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";

const LoginForm = (props: any) => {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Correo electrónico inválido.",
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500} mb="md">
        Hackaton I
      </Text>
      <form
        onSubmit={form.onSubmit(
          (value: { email: string; password: string }) => {
            signIn<RedirectableProviderType>("credentials", {
              redirect: false,
              email: value.email,
              password: value.password,
              callbackUrl: `${window.location.origin}`,
            }).then((res) => {
              if (res?.error) form.setFieldError("password", res?.error);
              else router.replace("/");
            });
          }
        )}
      >
        <Stack>
          <TextInput
            required
            label="Correo Electrónico"
            placeholder="hello@utec.edu.pe"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email && "Correo electrónico inválido"}
          />

          <PasswordInput
            required
            label="Contraseña"
            placeholder="Ingresar su contraseña"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            error={form.errors.password}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Button
            type="submit"
            styles={(theme) => ({
              root: {
                backgroundColor: "#003459",
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                "&:hover": {
                  backgroundColor: theme.fn.darken("#005980", 0.05),
                },
              },

              leftIcon: {
                marginRight: 15,
              },
            })}
          >
            Iniciar Sesión
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
export default LoginForm;
