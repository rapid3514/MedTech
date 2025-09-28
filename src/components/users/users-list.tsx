import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Search from "../navigation/Search";
import { useEffect, useState } from "react";
import { api } from "../../Service/api";
import type { User } from "../../store/auth.store";

const Userslist = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("/users");
        console.log("API response:", response.data);
        setUsers(response.data.items || response.data);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };
    getUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const userToDelete = users.find((u) => u.id === id);

      // 🔹 Agar admin bo‘lsa va aktiv adminlar soni 1ta bo‘lsa, o‘chirib yubormaymiz
      if (
        userToDelete?.role === "admin" &&
        users.filter((u) => u.role === "admin" && u.isActive).length <= 1
      ) {
        setError("At least one active admin must remain");
        return;
      }

      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Delete failed";
      setError(msg);
    }
  };

  return (
    <div>
      <div className="w-full rounded-lg mx-auto">
        <div className="flex items-center rounded-t-lg p-6 justify-between border border-gray-300">
          <h1 className="text-xl font-bold">User List</h1>
          <Search />
          <Link
            to="/create-user"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Create user
          </Link>
        </div>

        {/* Users grid */}
        <div className="p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-gray-300">
          {users.map((user) => (
            <Card key={user.id} className="shadow-md">
              <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={() => setError(null)}
              >
                <Alert
                  onClose={() => setError(null)}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {error}
                </Alert>
              </Snackbar>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {user.firstname} {user.lastname}
                </Typography>
                <Typography color="textSecondary">{user.email}</Typography>
                <Typography color="textSecondary">Role: {user.role}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => console.log("Edit user:", user.id)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Userslist;
