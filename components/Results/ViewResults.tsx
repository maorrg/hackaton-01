import { Box, Table } from "@mantine/core";
import axios from "axios";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ViewResults = () => {
  // const rows =
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
