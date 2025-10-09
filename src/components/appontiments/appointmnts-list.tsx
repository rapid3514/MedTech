import { useEffect, useState } from "react";
import { api } from "../../Service/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Appointment, User } from "../../store/auth.store";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments");
      const data = res.data.items || res.data; 
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchAppointments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Rostan ham ushbu appointmentni o‘chirmoqchimisiz?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Appointments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((a) => (
          <Card
            key={a.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
          >
            <CardContent>
              <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                🧑‍⚕️ Shifokor: {a.doctor.firstname} {a.doctor.lastname}
              </Typography>
              <Typography variant="body1" className="mb-1 text-gray-700">
                👤 Bemor: {a.patient.firstName} {a.patient.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                ⏰ Boshlanish: {new Date(a.startAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-1">
                🕒 Tugash: {new Date(a.endAt).toLocaleString()}
              </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-1">
                Reason: {a.reason}
              </Typography>
              <Typography
                variant="body2"
                className={`font-semibold mb-2 ${
                  a.status === "scheduled"
                    ? "text-blue-600"
                    : a.status === "completed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                📋 Status: {a.status}
              </Typography>

              {a.reason && (
                <Typography variant="body2" className="text-gray-600 mb-3">
                  📝 Sabab: {a.reason}
                </Typography>
              )}

              {user?.role === "admin" && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(a.id)}
                >
                  O‘chirish
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;
