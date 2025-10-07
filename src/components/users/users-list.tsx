import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { api } from "../../Service/api";
import Delete from "../navigation/delete";
import type { User } from "../../store/auth.store";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.items;
      setUsers(data || []);
    } catch (error) {
      console.error("Foydalanuvchilarni olishda xatolik:", error);
      setError("Foydalanuvchilarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsActive(user.isActive ?? true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/${selectedUser.id}/role`, { role: newRole });
      await api.patch(`/users/${selectedUser.id}/status`, { isActive });
      setUsers((prev) =>prev.map((u) =>u.id === selectedUser.id ? { ...u, role: newRole, isActive } : u)
      );
      handleCloseModal();
    } catch (err) {
      console.error("Yangilashda xatolik:", err);
      setError("Foydalanuvchini yangilashda xatolik yuz berdi");
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 2, maxWidth: "100%" }}>
      <div className="flex items-center justify-between">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Foydalanuvchilar ro‘yxati
        </Typography>
        <Link to={"/create-user"}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ mb: 3, fontWeight: 600, color: "blue" }}
            component="h1"
          >
            Create User
          </Typography>
        </Link>
      </div>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {users.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 2 }}
        >
          Hech qanday foydalanuvchi topilmadi
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ px: 1 }}>
          {users.map((user) => (
            <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: blue[500], mr: 2 }}>
                      {user.firstname?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {user.firstname} {user.lastname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color={user.role === "admin" ? "primary" : "text.secondary"}
                    sx={{ fontWeight: 500 }}
                  >
                    Rol: {user.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={user.isActive ? "green" : "red"}
                    sx={{ fontWeight: 500 }}
                  >
                    Holat: {user.isActive ? "Active" : "Inactive"}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pb: 2, px: 2 }}>
                  <Button
                    onClick={() => handleOpenModal(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white mt-3 rounded-md px-3 py-1"
                  >
                    Edit
                  </Button>
                  <Delete
                    id={user.id}
                    endpoint="/users"
                    onDeleted={() =>
                      setUsers((prev) => prev.filter((u) => u.id !== user.id))
                    }
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={newRole}
              label="Rol"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="reception">Reception</MenuItem>
            </Select>
          </FormControl>

          {/* Custom dark-mode toggle */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Holat:</span>
            <button
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`ml-2 font-medium ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isActive ? "Faol" : "Nofaol"}
            </span>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Bekor qilish</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
