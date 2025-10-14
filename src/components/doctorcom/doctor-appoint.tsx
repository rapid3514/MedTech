import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  TextField,
} from "@mui/material";
import { api } from "../../Service/api";
import { useAuth, type Appointment } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";

const Doctorappoint = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [openRecordModal, setOpenRecordModal] = useState(false);

  // 🔹 Record qo‘shish form holati
  const [recordType, setRecordType] = useState("");
  const [recordDescription, setRecordDescription] = useState("");
  const [recordPrescription, setRecordPrescription] = useState("");
  const [recordLoading, setRecordLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id && user.role === "doctor") {
      fetchDoctorAppointments(user.id);
    } else if (user?.role === "admin") {
      fetchAllAppointments();
    }
  }, [user]);

  const fetchDoctorAppointments = async (doctorId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/appointments?doctorId=${doctorId}`);
      const data = res.data.items || res.data;
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/appointments`);
      const data = res.data.items || res.data;
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setOpenModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedAppointment) return;
    try {
      await api.patch(`/appointments/${selectedAppointment.id}/status`, {
        status: newStatus,
      });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedAppointment.id ? { ...a, status: newStatus } : a
        )
      );
      setOpenModal(false);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 🔹 Record qo‘shish tugmasi bosilganda
  const handleAddRecordClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenRecordModal(true);
  };

  // 🔹 Recordni API orqali qo‘shish
  const handleAddRecord = async () => {
    if (!selectedAppointment) return;
    setRecordLoading(true);
    try {
      await api.post(`/patients/${selectedAppointment.patient.id}/records`, {
        type: recordType || "consultation",
        description: recordDescription,
        prescription: recordPrescription,
      });

      setOpenRecordModal(false);
      setRecordType("");
      setRecordDescription("");
      setRecordPrescription("");
      alert("Record muvaffaqiyatli qo‘shildi ✅");
    } catch (err) {
      console.error("Error adding record:", err);
      alert("Xatolik yuz berdi ❌");
    } finally {
      setRecordLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Typography variant="h5" className="text-center font-semibold mb-6">
        Mening uchrashuvlarim 🩺
      </Typography>

      {appointments.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Hozircha appointmentlar yo‘q.
        </Typography>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          {appointments.map((a) => (
            <Card
              key={a.id}
              className="shadow-md hover:shadow-lg transition-all rounded-lg"
            >
              <CardContent>
                <Typography variant="subtitle1" className="font-semibold">
                  Ism: {a.patient.firstName}
                </Typography>
                <Typography variant="subtitle1" className="font-semibold">
                  Familiya: {a.patient.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  🕓 {new Date(a.startAt).toLocaleString()} -{" "}
                  {new Date(a.endAt).toLocaleTimeString()}
                </Typography>

                <Typography
                  variant="body2"
                  className={`mt-2 ${
                    a.status === "scheduled"
                      ? "text-blue-500"
                      : a.status === "completed"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  Status: {a.status}
                </Typography>

                <Divider className="my-2" />

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEditClick(a)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => navigate(`/patient/${a.patient.id}/records`)}
                  >
                    View Records
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleAddRecordClick(a)}
                  >
                    Add Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔹 Status o‘zgartirish modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Statusni o‘zgartirish</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Yangi status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Yangi status"
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Bekor qilish
          </Button>
          <Button
            onClick={handleSaveStatus}
            color="primary"
            variant="contained"
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Record qo‘shish modal */}
      <Dialog open={openRecordModal} onClose={() => setOpenRecordModal(false)}>
        <DialogTitle>Yangi Record qo‘shish</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Record turi</InputLabel>
            <Select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              label="Record turi"
            >
              <MenuItem value="consultation">Consultation</MenuItem>
              <MenuItem value="diagnosis">Diagnosis</MenuItem>
              <MenuItem value="treatment">Treatment</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={recordDescription}
            onChange={(e) => setRecordDescription(e.target.value)}
          />

          <TextField
            label="Prescription"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={recordPrescription}
            onChange={(e) => setRecordPrescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenRecordModal(false)}
            color="secondary"
            disabled={recordLoading}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleAddRecord}
            color="primary"
            variant="contained"
            disabled={recordLoading}
          >
            {recordLoading ? "Qo‘shilmoqda..." : "Qo‘shish"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Doctorappoint;
