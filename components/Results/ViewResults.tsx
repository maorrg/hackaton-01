import { Badge, Box, Button, LoadingOverlay, Table } from "@mantine/core";
import { useRouter } from "next/router";
import { defaultFetcher } from "../../utils/fetcher";
import useSWR from "swr";

const ViewResults = () => {
  const { data, error, mutate } = useSWR("/api/results", defaultFetcher);
  const router = useRouter();

  if (error) return <div>failed to load</div>;
  if (!data) return <LoadingOverlay visible={true} />;

  const rows = data?.map(
    (element: { courseId: number; name: string; ratingavg: number }) => (
      <tr key={element.courseId}>
        <td>{element.name}</td>
        <td>
          <Badge
            size="md"
            style={{ width: 50 }}
            color={element.ratingavg < 4 ? "red" : "green"}
          >
            {element.ratingavg.toFixed(1)}
          </Badge>
        </td>
        <td>
          <Button
            variant="light"
            radius="xl"
            size="xs"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              router.push(`/results/${element.courseId}`);
            }}
          >
            Ver
          </Button>
        </td>
      </tr>
    )
  );
  return (
    <Box sx={{ maxWidth: 900 }} mx="auto">
      <h1>Resultados</h1>
      <Table>
        <thead>
          <tr>
            <th>Nombre del curso</th>
            <th>Calificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  );
};

export default ViewResults;
