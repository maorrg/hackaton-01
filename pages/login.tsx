import { Box } from "@mantine/core";
import LoginForm from "../components/Login/LoginForm";
import { NextPageWithAuth } from "../types/nextPageAuth";
import { Role } from "../types/role";

const Login: NextPageWithAuth = () => {
  return (
    <Box sx={{ maxWidth: 600, margin: 50 }} mx="auto">
      <LoginForm />
    </Box>
  );
};

Login.auth = { role: Role.GUEST };
export default Login;
