import { useEffect, useState } from "react";
import { api } from "../../Service/api";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { Patient } from "../../store/auth.store";

const Doctorpatient = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/patients");

      const data = res.data.items || res.data;
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Bemorlarni yuklashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Barcha bemorlar 👨‍⚕️
      </h1>

      {patients.length === 0 ? (
        <Typography color="textSecondary" align="center">
          Hozircha bemorlar mavjud emas.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {patients.map((p) => (
            <Card
              key={p.id}
              className="shadow-md hover:shadow-lg transition-all rounded-lg"
            >
              <CardContent>
                <Typography variant="h6" className="font-semibold">
                  👤 {p.firstName} {p.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📧 {p.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  📞 {p.phone || "Telefon mavjud emas"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  🧬 Jinsi: {p.gender || "Ko‘rsatilmagan"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctorpatient;
