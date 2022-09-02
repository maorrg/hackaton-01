import {
  Box,
  Button,
  Center,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  Select,
  Slider,
  Stepper,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Feedback } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  AiFillStar,
  AiOutlineComment,
  AiOutlineUnorderedList,
  AiTwotoneStar,
} from "react-icons/ai";
import { TbSend } from "react-icons/tb";
import ReactStars from "react-stars";
import { useRouter } from "next/router";

const buildFormInitialValues = () => {
  return {
    courseId: "",
    teacherId: "",
    rating: "",
    comment: "",
    suggestion: "",
  };
};

const ViewFeedback = () => {
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<{ [courseName: string]: [] }>({});
  const [teachersForSelectedCourse, setTeachersForSelectedCourse] = useState<
    any[]
  >([]);

  const router = useRouter();

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm({
    initialValues: buildFormInitialValues(),
  });

  const createFeedback = (values: any) => {
    axios
      .post(`/api/feedback`, { values })
      .then((res) => {
        nextStep();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/api/sections`).then((res) => {
      setIsLoading(false);
      setCourses(res.data.courses);
      setTeachers(res.data.teachers);
      setIsLoading(false);
    });
  }, []);

  const handleCourseChange = (value: string) => {
    setTeachersForSelectedCourse(teachers[value]);
    setCourse(value);
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
        onSubmit={form.onSubmit((values) => {
          createFeedback(values);
        })}
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
                    placeholder="Seleccione el curso a califacar"
                    description="Seleccione el curso que desea calficar."
                    value={course}
                    onChange={handleCourseChange}
                    data={courses}
                    rightSection={isLoading ? <Loader size="xs" /> : false}
                    required
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
            </Stepper.Step>
            <Stepper.Step
              label="Comentario"
              description="Cuentanos un poco más"
              allowStepSelect={active > 2}
              icon={<AiOutlineComment size={18} />}
            >
              <Textarea
                label="Comentario"
                description="Cuentanos un poco sobre tu experiencia en el curso, tanto los puntos positivos como los que debemos mejorar."
                placeholder="Escriba su comentario aquí."
                required
                {...form.getInputProps("comment")}
              />
              <Textarea
                style={{ marginTop: 10 }}
                label="Sugerencia"
                description="Puedes escribir cualquier sugerencia que tengas hacia el curso."
                placeholder="Escriba su comentario aquí."
                {...form.getInputProps("suggestion")}
              />
            </Stepper.Step>
            <Stepper.Completed>¡Gracias por el Feedback!</Stepper.Completed>
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
                <Button type="submit" leftIcon={<TbSend size={16} />}>
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
function showNotification(arg0: {
  title: string;
  message: string;
  autoClose: number;
  color: string;
  icon: JSX.Element;
}) {
  throw new Error("Function not implemented.");
}

function handleErrorMessageForFeedback(err: any) {
  if (
    err.response.data.code === "P2002" &&
    err.response.data.meta.target == "Influencer_username_key"
  ) {
    showNotification({
      title: "¡ERROR!",
      message: "El influencer fue creado correctamente.",
      autoClose: 5000,
      color: "red",
      icon: <FiCheck size={20} />,
    });
  } else if (
    err.response.data.code === "P2002" &&
    err.response.data.meta.target == "Influencer_userId_key"
  )
    showNotification({
      title: "¡ERROR!",
      message: "El influencer fue creado correctamente.",
      autoClose: 5000,
      color: "red",
      icon: <FiCheck size={20} />,
    });
  else
    showNotification({
      title: "¡ERROR!",
      message: "El influencer fue creado correctamente.",
      autoClose: 5000,
      color: "red",
      icon: <FiCheck size={20} />,
    });
}
