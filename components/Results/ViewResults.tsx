import { Box, Table } from "@mantine/core";
import axios from "axios";
import { useEffect } from "react";

const ViewResults = () => {
  // const rows =

  useEffect(() => {
    axios.get();
  });

  return (
    <Box sx={{ maxWidth: 900 }} mx="auto">
      <h1>Resultados</h1>
      <Table>
        <thead>
          <tr>
            <th>Nombre del curso</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Box>
  );
};

export default ViewResults;
