// src/components/users/Userslist.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Search from "../navigation/Search";
import { useEffect, useState } from "react";
import { api } from "../../Service/api";
import type { User } from "../../store/auth.store";

const Userslist = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedData, setEditedData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (q?: string) => {
    try {
      const response = await api.get("/users", {
        params: q ? { q } : {},
      });
      const data = response.data.items ?? response.data;
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Foydalanuvchilarni olishda xatolik");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Delete failed";
      setError(msg);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await api.patch(`/users/${user.id}/status`, {
        isActive: !user.isActive,
      });
      setUsers((oldUsers) =>
        oldUsers.map((u) =>
          u.id === user.id ? { ...u, isActive: response.data.isActive } : u
        )
      );
    } catch (err: any) {
      const message = err.response?.data?.message || "Status update failed";
      setError(message);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditedData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      role: user.role || "",
    });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    setError(null);

    try {
      const response = await api.patch(`/users/${selectedUser.id}`, {
        firstname: editedData.firstname,
        lastname: editedData.lastname,
        email: editedData.email,
        role: editedData.role,
      });

      const updated = response.data;
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updated } : u)));
      setOpen(false);
    } catch (err: any) {
      if (err.response?.status === 404) {
        try {
          const respRole = await api.patch(`/users/${selectedUser.id}/role`, {
            role: editedData.role,
          });
          setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? { ...u, role: respRole.data.role } : u))
          );
          setOpen(false);
        } catch (err2: any) {
          setError(err2.response?.data?.message || "Update failed");
        }
      } else {
        setError(err.response?.data?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="w-full rounded-lg mx-auto">
        <div className="flex items-center rounded-t-lg p-6 justify-between border border-gray-300">
          <h1 className="text-xl font-bold">User List</h1>
          <Search onSearch={fetchUsers} />
          <Link to="/create-user" className="text-blue-600 underline hover:text-blue-800">
            Create user
          </Link>
        </div>

        <div className="p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-gray-300">
          {users.map((user) => (
            <Card key={user.id} className="shadow-md">
              <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
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

              <CardActions sx={{ justifyContent: "space-between" }}>
                <FormControlLabel
                  control={<Switch checked={user.isActive} onChange={() => handleToggleActive(user)} color="primary" />}
                  label={user.isActive ? "Active" : "Blocked"}
                />

                <div>
                  <Button size="small" color="primary" variant="contained" sx={{marginRight:1}} onClick={() => handleEditClick(user)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </div>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
      <h1>{editedData.firstname}</h1>
      <h1>{editedData.lastname}</h1>
      <h1>{editedData.email}</h1>
          <TextField select label="Role" name="role" value={editedData.role} onChange={handleChange} fullWidth margin="dense">
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="reception">Reception</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Userslist;
