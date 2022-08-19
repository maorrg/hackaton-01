import { Box } from "@mantine/core";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  return (
    <Box sx={{ maxWidth: 600, margin: 50 }} mx="auto">
      <LoginForm />
    </Box>
  );
};

export default Login;
