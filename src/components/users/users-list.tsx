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
        <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Foydalanuvchilar ro‘yxati
      </Typography>
      <Link to={"/create-user"}>
      <Typography     variant="h4"
         gutterBottom
        sx={{ mb: 3, fontWeight: 600,color:'blue' }}
        component="h1">Create User</Typography>
      </Link>
    </div>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
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
            <Grid key={user.id}>
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
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pb: 2, px: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Tahrirlash
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
    </Container>
  );
};

export default UserList;
