
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth.store";
import { api } from "../../Service/api";
import { Button } from "@mui/material";
const Logout = () => {
    const { logout } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    try {
      await api.post("/auth/logout");
    } catch {console.log('xato')}
    logout();
    nav("/login", { replace: true });
  }

  return <Button variant="contained" onClick={onLogout}>Logout</Button>;
}

export default Logout