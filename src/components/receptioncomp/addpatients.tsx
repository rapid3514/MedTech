import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { api } from "../../Service/api"; 

const Appointments = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await api.post("/patients", form); 
      setSuccess("Bemor muvaffaqiyatli qo‘shildi!");
      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        phone: "",
        email: "",
        notes: "",
      });
    } catch (err: any) {
      setError("Xatolik yuz berdi, qayta urinib ko‘ring!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 5,
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Bemor qo‘shish
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Ism"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Familiya"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Jinsi"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="male">Erkak</MenuItem>
            <MenuItem value="female">Ayol</MenuItem>
          </TextField>
          <TextField
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Izoh"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          {success && (
            <Typography color="success.main" mt={2}>
              {success}
            </Typography>
          )}
          {error && (
            <Typography color="error.main" mt={2}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Saqlanmoqda..." : "Qo‘shish"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Appointments;
