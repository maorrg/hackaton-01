import React from "react";
import { Container, Alert, Button } from "@mantine/core";

import { FiAlertCircle } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface UnauthorizedProps {
  user: Session["user"];
}

export function Unauthorized(props: UnauthorizedProps) {
  return (
    <Container my="xs" pt="xl">
      <Alert
        icon={<FiAlertCircle size={16} />}
        title="¡No Autorizado!"
        color="red"
      >
        {props.user.name}, no estás autorizado en acceder a esta página con el
        rol {props.user.role}. Si crees que es un error, contáctate con los
        administradores del sistema.
      </Alert>
      <Button variant="default" mt="lg" onClick={() => signOut()}>
        Cerrar Sesión
      </Button>
    </Container>
  );
}
