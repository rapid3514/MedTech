import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { api } from "../../Service/api";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const PatientsManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [open, setOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data.items || res.data);
    } catch (err) {
      console.error("Fetch patients error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      await api.patch(`/patients/${selected.id}`, {
        firstName: selected.firstName,
        lastName: selected.lastName,
        gender: selected.gender,
        phone: selected.phone,
        email: selected.email,
        notes: selected.notes,
      });
      setOpen(false);
      fetchPatients();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient) => (
        <Card key={patient.id} className="shadow-md">
          <CardContent>
            <Typography variant="h6">
              {patient.firstName} {patient.lastName}
            </Typography>
            <Typography>Jinsi: {patient.gender}</Typography>
            <Typography>Email: {patient.email}</Typography>
            <Typography>Telefon: {patient.phone}</Typography>
            <Typography>Izoh: {patient.notes}</Typography>
            <Typography variant="body2" color="textSecondary">
              Yar. sana: {new Date(patient.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Yangilangan: {new Date(patient.updatedAt).toLocaleString()}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                setSelected(patient);
                setOpen(true);
              }}
            >
              O‘zgartirish
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Dialog tahrirlash */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Patient ma’lumotlarini tahrirlash</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Ism"
            fullWidth
            value={selected?.firstName ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, firstName: e.target.value } : prev
              )
            }
          />
          <TextField
            margin="dense"
            label="Familiya"
            fullWidth
            value={selected?.lastName ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, lastName: e.target.value } : prev
              )
            }
          />
          <TextField
            margin="dense"
            label="Jinsi"
            fullWidth
            value={selected?.gender ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, gender: e.target.value } : prev
              )
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={selected?.email ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, email: e.target.value } : prev
              )
            }
          />
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            value={selected?.phone ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, phone: e.target.value } : prev
              )
            }
          />
          <TextField
            margin="dense"
            label="Izoh"
            fullWidth
            multiline
            rows={3}
            value={selected?.notes ?? ""}
            onChange={(e) =>
              setSelected((prev) =>
                prev ? { ...prev, notes: e.target.value } : prev
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientsManagement;
