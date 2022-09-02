import {
  Box,
  Input,
  Select,
  Title,
  Text,
  Group,
  Button,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdQuestionAnswer } from "react-icons/md";

const buildFormInitialValues = () => {
  return {
    courseId: "",
    teacherId: "",
    rating: "",
    comment: "",
    sugestion: "",
  };
};

const saveSecuritySettings = (values: any) => {
  axios
    .post(`/api/security-settings`, { formValues: values })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const ViewResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const form = useForm({
    initialValues: buildFormInitialValues(),
  });

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/security-settings/questions`).then(async (res) => {
      setIsLoading(false);
      setQuestions(res.data);
    });
  }, []);

  return (
    <>
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
          />
          <Text style={{ marginTop: 15 }} size="sm">
            Resupuesta
          </Text>
          <Text color="gray" size="xs">
            Ingrese la respuesta a la pregunta.
          </Text>
          <Input icon={<MdQuestionAnswer />} placeholder="Su respuesta" />
          <Group position="center" mt="xl">
            <Button variant="light" type="submit">
              Guardar
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default ViewResults;
