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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { api } from "../../Service/api";
import Delete from "../navigation/delete";
import type { User } from "../../store/auth.store";


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
      <div className="flex justify-center mt-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" className="font-semibold mb-6">
        Foydalanuvchilar ro‘yxati
      </Typography>

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
        <Typography variant="body1" color="text.secondary">
          Hech qanday foydalanuvchi topilmadi
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <div className="flex items-center justify-around flex-wrap" >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar sx={{ bgcolor: blue[500], width: 60, height: 60, mb: 2 }}>
                    {user.firstname?.[0] || "?"}
                  </Avatar>

                  <Typography variant="h6" gutterBottom>
                    {user.firstname} {user.lastname}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>

                  <Typography
                    variant="body2"
                    color={user.role === "admin" ? "primary" : "text.secondary"}
                    sx={{ mt: 1 }}
                  >
                    Role: <b>{user.role}</b>
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => alert(`${user.firstname} ni tahrirlash funksiyasi`)}
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
            </div>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserList;
