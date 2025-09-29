import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";
import { api } from "../Service/api";
import { rolePath } from "../Routes/role-path";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const { data } = await api.post("/auth/login", { email, password });
    login(data.access_token, data.user);
    if (data.user.mustChangePassword) {
      nav("/change-password", { replace: true });
      return;
    }
    nav(rolePath[data.user.role as keyof typeof rolePath], { replace: true });
  }

  return (
   <Box
  sx={{
    width: "100%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    mt: "200px",
  }}
>
  <Paper elevation={3} sx={{ p: 3, width: "100%", maxWidth: 400 }}>
    <Typography variant="h5" align="center" gutterBottom>
      Login to your account
    </Typography>
    <form onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          placeholder="m@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />

        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Password</Typography>
            <Link
              href="/forgot-password"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
        </Box>

        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </Box>
    </form>
  </Paper>
</Box>

  );
};

export default Login;
