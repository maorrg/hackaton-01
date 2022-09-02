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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
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

  const form = useForm({
    initialValues: buildFormInitialValues(),
  });

  const saveSecuritySettings = (values: any) => {
    axios
      .post(`/api/security-settings`, { formValues: values })
      .then((res) => {
        router.replace("/");
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
  if (!user) return <p>No profile data</p>;

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
              description="Se le realizará esta pregunta cada vez que desea dar feedbakc sobre un curso."
              placeholder="Seleccione una pregunta"
              data={questions}
              rightSection={isLoading ? <Loader size="xs" /> : false}
              required
              {...form.getInputProps("securityQuestionId")}
            />
            <Input.Wrapper
              label="Respuesta"
              style={{ marginTop: 20 }}
              description="Ingrese la respuesta a la pregunta."
              required
            >
              <Input
                icon={<MdQuestionAnswer />}
                placeholder="Su respuesta"
                required
                {...form.getInputProps("answer")}
              />
            </Input.Wrapper>
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
            Si tiene problemas con su cuenta y desea reestablecer su pregunta de
            seguridad por favor comuníquese con soporte.
          </Alert>
        </Container>
      )}
    </>
  );
};

export default SecurityQuestions;
