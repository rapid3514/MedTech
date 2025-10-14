import { useEffect, useState } from "react";
import { api } from "../../Service/api";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/auth.store";

interface MedicalRecord {
  id: string;
  type: string;
  description: string;
  prescription: string;
  createdAt: string;
  author: {
    firstname: string;
    lastname: string;
    role: string;
  };
}

const RecordsPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/patients/${patientId}/records`);
      setRecords(res.data.items || res.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchRecords();
  }, [patientId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  // 🔹 Record mavjudligini tekshirish

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Typography variant="h5" className="font-semibold mb-4 text-center">
        Bemorning Medical Recordlari 🩺
      </Typography>

      {/* --- 🔹 2. Recordlar ro‘yxati --- */}
      {records.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Hech qanday medical record topilmadi.
        </Typography>
      ) : (
        records.map((r) => (
          <Card key={r.id} className="mb-4 shadow-md rounded-lg">
            <CardContent>
              <Typography variant="subtitle1" className="font-semibold">
                {r.type.toUpperCase()}
              </Typography>
              <Typography variant="body2" className="mt-1">
                <strong>Description:</strong> {r.description}
              </Typography>
              <Typography variant="body2">
                <strong>Prescription:</strong> {r.prescription}
              </Typography>
              <Divider className="my-2" />
              <Typography variant="caption" color="textSecondary">
                {new Date(r.createdAt).toLocaleString()} — {r.author.firstname}{" "}
                {r.author.lastname} ({r.author.role})
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <div className="text-center mt-6">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.history.back()}
        >
          Orqaga
        </Button>
      </div>
    </div>
  );
};

export default RecordsPage;
