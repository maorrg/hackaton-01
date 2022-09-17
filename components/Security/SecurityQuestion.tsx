import {
  Box,
  Input,
  Select,
  Title,
  Text,
  Group,
  Button,
  Loader,
  LoadingOverlay,
  Container,
  Alert,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { MdQuestionAnswer } from "react-icons/md";

const buildFormInitialValues = () => {
  return {
    securityQuestionId: "",
    answer: "",
  };
};

const SecurityQuestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const session = useSession();

  const form = useForm({
    initialValues: buildFormInitialValues(),
  });

  const saveSecuritySettings = (values: any) => {
    axios
      .post(`/api/security-settings`, { formValues: values })
      .then((res) => {
        if (session.data?.user.role == "STUDENT") router.replace("/feedback");
        else if (session.data?.user.role == "TEACHER")
          router.replace("/results");
        else router.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/user`).then(async (res) => {
      setIsLoading(false);
      setUser(res.data);
    });

    axios.get(`/api/security-settings/questions`).then(async (res) => {
      setIsLoading(false);
      setQuestions(res.data);
    });
  }, []);

  if (isLoading) return <LoadingOverlay visible={isLoading} overlayBlur={1} />;
  if (!user) return <LoadingOverlay visible={isLoading} overlayBlur={1} />;

  return (
    <>
      {user.userSecurityValidation === null ? (
        <Box sx={{ maxWidth: 900 }} mx="auto">
          <Title mb="sm" mt="lg">
            Seguridad
          </Title>
          <form
            onSubmit={form.onSubmit((values) => {
              saveSecuritySettings(values);
            })}
          >
            <Select
              label="Seleccione su pregunta de seguridad"
              description="Se le realizará esta pregunta cada vez que desea dar feedback sobre un curso."
              placeholder="Seleccione una pregunta"
              data={questions}
              rightSection={isLoading ? <Loader size="xs" /> : false}
              required
              {...form.getInputProps("securityQuestionId")}
            />
            <PasswordInput
              label="Respuesta"
              style={{ marginTop: 20 }}
              description="Ingrese la respuesta a la pregunta."
              icon={<MdQuestionAnswer />}
              placeholder="Su respuesta"
              required
              {...form.getInputProps("answer")}
            />
            <Group position="center" mt="xl">
              <Button variant="light" type="submit">
                Guardar
              </Button>
            </Group>
          </form>
        </Box>
      ) : (
        <Container my="xs" pt="xl">
          <Alert
            icon={<FiAlertCircle size={16} />}
            title="¡Pregunta de seguridad establecida!"
            color="yellow"
          >
            Si tienes problemas con tu cuenta y deseas reestablecer la pregunta
            de seguridad, por favor comunícate con soporte.
          </Alert>
        </Container>
      )}
    </>
  );
};

export default SecurityQuestions;
