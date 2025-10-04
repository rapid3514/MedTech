import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";
import { api } from "../../Service/api";
import type { Patient } from "../../store/auth.store";

const Patentsmenegmant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = async () => {
    try {
      const res = await api.get(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      console.error("Fetch patient error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!patient) return;
    setSaving(true);
    setError(null);

    try {
  const response = await api.patch(`/patients/${id}`, {
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        notes: patient.notes,
});
      setPatient(response.data)
      navigate(-1); 
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Yangilashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  if (loading) return <Typography>Yuklanmoqda...</Typography>;
  if (!patient) return <Typography>Bemor topilmadi</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Patient ma’lumotlarini tahrirlash
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        margin="dense"
        label="Ism"
        fullWidth
        value={patient.firstName}
        onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Familiya"
        fullWidth
        value={patient.lastName}
        onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
      />
    <TextField
  margin="dense"
  label="Jinsi"
  fullWidth
  select
  value={patient.gender}
  onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
>
  <MenuItem value="male">Erkak</MenuItem>
  <MenuItem value="female">Ayol</MenuItem>
</TextField>

      <TextField
        margin="dense"
        label="Email"
        type="email"
        fullWidth
        value={patient.email}
        onChange={(e) => setPatient({ ...patient, email: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Telefon"
        fullWidth
        value={patient.phone}
        onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Izoh"
        fullWidth
        multiline
        rows={3}
        value={patient.notes}
        onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
      />

      <div style={{ marginTop: 16 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate(-1)}>
          Bekor qilish
        </Button>
      </div>
    </Container>
  );
};

export default Patentsmenegmant;
