import {
  Alert,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Input,
  Loader,
  Modal,
  Select,
  Stepper,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  AiOutlineComment,
  AiOutlineUnorderedList,
  AiTwotoneStar,
} from "react-icons/ai";
import { TbLock, TbSend } from "react-icons/tb";
import ReactStars from "react-stars";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { MdQuestionAnswer } from "react-icons/md";
import { IoIosRemoveCircle } from "react-icons/io";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiAlertCircle } from "react-icons/fi";

const buildFormInitialValues = () => {
  return {
    courseId: "",
    teacherId: "",
    rating: "",
    comment: "",
    suggestion: "",
    securityQuestionId: "",
    answer: "",
  };
};

const ViewFeedback = () => {
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formError, setFormError] = useState(false);
  const [course, setCourse] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<{ [courseName: string]: [] }>({});
  const [teachersForSelectedCourse, setTeachersForSelectedCourse] = useState<
    any[]
  >([]);

  const router = useRouter();

  const formStepperValidation = (current: number) => {
    switch (current) {
      case 0: {
        if (form.values.teacherId && form.values.courseId) return true;
        return false;
      }
      case 1: {
        if (form.values.rating) return true;
        return false;
      }
      case 2: {
        if (form.values.comment) return true;
        return false;
      }
    }
  };

  const nextStep = () => {
    if (formStepperValidation(active)) {
      setFormError(false);
      setActive((current) => (current < 3 ? current + 1 : current));
    } else {
      setFormError(true);
    }
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: buildFormInitialValues(),
  });

  const handleSubmit = () => {
    createFeedback(form.values);
  };

  const createFeedback = (values: any) => {
    axios
      .post(`/api/feedback`, { values })
      .then((res) => {
        setOpened(false);
        nextStep();
      })
      .catch((err) => {
        form.setFieldValue("securityQuestionId", "");
        form.setFieldValue("answer", "");
        setOpened(false);
        showNotification({
          title: "¡Error de autentificación!",
          message:
            "Las credenciales ingresadas son incorrectas, intente nuevamente.",
          autoClose: 5000,
          color: "red",
          icon: <IoIosRemoveCircle size={20} />,
        });
      });
  };

  const validateSecurity = () => {
    if (formStepperValidation(active)) setOpened(true);
    else {
      setFormError(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/sections`).then((res) => {
      setIsLoading(false);
      setCourses(res.data.courses);
      setTeachers(res.data.teachers);
      setIsLoading(false);
    });
    setIsLoading(true);
    axios.get(`/api/security-settings/questions`).then(async (res) => {
      setIsLoading(false);
      setQuestions(res.data);
    });
  }, []);

  const handleCourseChange = (value: string) => {
    setTeachersForSelectedCourse(teachers[value]);
    setCourse(value);
    form.setFieldValue("teacherId", "");
    const array: any = teachers[value];
    if (array.length < 2) {
      form.setFieldValue("teacherId", array[0].value);
    }
    form.setFieldValue("courseId", value);
  };

  const handleTeacherChange = (value: string) => {
    form.setFieldValue("teacherId", value);
  };

  return (
    <Box sx={{ maxWidth: 900 }} mx="auto">
      {/* <LoadingOverlay visible={isLoading} overlayBlur={1} /> */}
      <Title mb="sm" mt="lg">
        Registrar feedback
      </Title>
      <form
      // onSubmit={form.onSubmit((values) => {
      //   createFeedback(values);
      // })}
      >
        <>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step
              label="Curso"
              description="Selecciona el curso"
              allowStepSelect={active > 0}
              icon={<AiOutlineUnorderedList size={18} />}
            >
              <Grid sx={{ maxWidth: 900 }} mx="auto">
                <Grid.Col span={6}>
                  <Select
                    label="Curso"
                    placeholder="Seleccione el curso a calificar"
                    description="Seleccione el curso que desea calficar."
                    value={course}
                    onChange={handleCourseChange}
                    data={courses}
                    rightSection={isLoading ? <Loader size="xs" /> : false}
                    required
                    error={
                      formError && !form.values.courseId
                        ? "Campo requerido."
                        : false
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  {teachersForSelectedCourse.length > 1 ? (
                    <Select
                      label="Profesor"
                      description="Seleccione el profesor que desea evaluar."
                      placeholder="Seleccione el profesor"
                      data={teachersForSelectedCourse}
                      required
                      onChange={handleTeacherChange}
                      value={form.values.teacherId}
                      error={
                        formError && !form.values.teacherId
                          ? "Campo requerido."
                          : false
                      }
                    />
                  ) : (
                    <Select
                      label="Profesor"
                      description="Seleccione el profesor que desea evaluar."
                      placeholder="Seleccione el profesor"
                      data={teachersForSelectedCourse}
                      onChange={handleTeacherChange}
                      readOnly
                      disabled
                      value={
                        teachersForSelectedCourse[0] !== undefined
                          ? teachersForSelectedCourse[0].value
                          : ""
                      }
                      required
                    />
                  )}
                </Grid.Col>
              </Grid>
            </Stepper.Step>
            <Stepper.Step
              label="Calificación"
              description="Califica tu curso"
              allowStepSelect={active > 1}
              icon={<AiTwotoneStar size={18} />}
            >
              <Title order={3}>Calificación</Title>
              <Box
                sx={(theme) => ({
                  backgroundColor: theme.colors.gray[1],
                  textAlign: "center",
                  padding: theme.spacing.xl,
                  borderRadius: theme.radius.md,
                  cursor: "pointer",
                })}
              >
                <Center>
                  <ReactStars
                    count={5}
                    size={40}
                    color2={"#ffd700"}
                    {...form.getInputProps("rating")}
                  />
                </Center>
              </Box>
              {formError && !form.values.rating && (
                <Alert
                  icon={<FiAlertCircle size={16} />}
                  title="¡Campo requerido!"
                  color="yellow"
                  style={{ marginTop: 10 }}
                >
                  Es necesaria una calficación para continuar.
                </Alert>
              )}
            </Stepper.Step>
            <Stepper.Step
              label="Comentario"
              description="Cuentanos un poco más"
              allowStepSelect={active > 2}
              icon={<AiOutlineComment size={18} />}
            >
              <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Validación de seguridad"
              >
                <Select
                  label="Seleccione su pregunta de seguridad"
                  description="Seleccione la misma pregunta que escogió en la configuración de seguridad."
                  placeholder="Seleccione su pregunta"
                  data={questions}
                  rightSection={isLoading ? <Loader size="xs" /> : false}
                  required
                  {...form.getInputProps("securityQuestionId")}
                />
                <Input.Wrapper
                  label="Respuesta"
                  description="Ingrese la respuesta a la pregunta."
                  required
                  style={{ marginTop: 10 }}
                >
                  <Input
                    icon={<MdQuestionAnswer />}
                    placeholder="Su respuesta"
                    required
                    {...form.getInputProps("answer")}
                  />
                </Input.Wrapper>
                <Group position="center" mt="xl">
                  <Button
                    style={{ marginTop: 5, width: 1000 }}
                    type="submit"
                    leftIcon={<TbLock size={16} />}
                    onClick={handleSubmit}
                  >
                    Validar
                  </Button>
                </Group>
              </Modal>
              <Textarea
                label="Comentario"
                description="Cuentanos un poco sobre tu experiencia en el curso, tanto los puntos positivos como los que debemos mejorar."
                placeholder="Escriba su comentario aquí."
                required
                {...form.getInputProps("comment")}
              />
              {formError && !form.values.comment && (
                <Alert
                  icon={<FiAlertCircle size={16} />}
                  title="¡Campo requerido!"
                  color="yellow"
                  style={{ marginTop: 10 }}
                >
                  Es necesaria un comentario para continuar.
                </Alert>
              )}
              <Textarea
                style={{ marginTop: 10 }}
                label="Sugerencia"
                description="Puedes escribir cualquier sugerencia que tengas hacia el curso."
                placeholder="Escriba su comentario aquí."
                {...form.getInputProps("suggestion")}
              />
            </Stepper.Step>
            <Stepper.Completed>
              <Alert
                icon={<BsFillCheckCircleFill size={16} />}
                title="¡Gracias por el feedback!"
              >
                Constantemente buscamos ser mejores, gracias por formar parte.
              </Alert>
            </Stepper.Completed>
          </Stepper>

          {active <= 2 ? (
            <Group position="right" mt="xl">
              {active && (
                <Button variant="default" onClick={prevStep}>
                  Anterior
                </Button>
              )}
              {active < 2 ? (
                <Button onClick={nextStep}>Siguiente</Button>
              ) : (
                <Button
                  onClick={validateSecurity}
                  leftIcon={<TbSend size={16} />}
                >
                  Enviar
                </Button>
              )}
            </Group>
          ) : (
            <Group position="right" mt="xl">
              <Button onClick={() => router.reload()}>
                Completar otro formulario
              </Button>
            </Group>
          )}
        </>
      </form>
    </Box>
  );
};

export default ViewFeedback;
