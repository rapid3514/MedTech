import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { api } from "../../Service/api";
import { Link, useNavigate } from "react-router-dom";
import type { Patient } from "../../store/auth.store";
import { useAuth } from "../../store/auth.store";
import Delete from "../navigation/delete";

const PatentsList = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const fetchPatients = async (search = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/patients", { params: { q: search } });
      setPatients(data.items);
    } catch (err) {
      console.error("Fetch patients error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPatients(query);
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <Box sx={{ p: 3 }}>
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h5" gutterBottom>
          Bemorlar ro‘yxati
        </Typography>
        {role === "admin" && (
          <Link to="/create-patents" className="text-2xl text-blue-600">
            Create new patient
          </Link>
        )}
      </div>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Bemor qidirish (ism, familiya, email, telefon)"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {patients.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
              Hech qanday bemor topilmadi
            </Typography>
          ) : (
            patients.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-around flex-wrap"
              >
                <Card sx={{ borderRadius: 2, boxShadow: 3, width: 300 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: blue[500] }}>
                        {p.firstName.charAt(0)}
                      </Avatar>
                    }
                    title={`${p.firstName} ${p.lastName}`}
                    subheader={p.email || "Email mavjud emas"}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Jinsi: {p.gender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Telefon: {p.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Izoh: {p.notes || "—"}
                    </Typography>

                    <div className="flex items-center gap-2 mt-3">
                      {/* 🆕 SEE button */}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/patients-detail/${p.id}`)}
                      >
                        See
                      </Button>

                      {/* Tahrirlash */}
                      <Link
                        to={`/patients/${p.id}`}
                        className="text-blue-500 inline-block"
                      >
                        Tahrirlash
                      </Link>

                      {/* O‘chirish */}
                      <Delete
                        id={p.id}
                        endpoint="/patients"
                        onDeleted={() =>
                          setPatients((prev) =>
                            prev.filter((x) => x.id !== p.id)
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PatentsList;
