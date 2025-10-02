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
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { api } from "../../Service/api";
import { Link } from "react-router-dom";
import type { Patient } from "../../store/auth.store";



const AppointmentsList = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]  
  );
  const [loading, setLoading] = useState(false)
  const fetchPatients = async (search = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/patients", {params:{ q: search },});
console.log(data,'sa');
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
        <Link to="/create-patents" className="text-2xl">
          Create new patient
        </Link>
      </div>

      {/* Search Input */}
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
              <Grid item xs={12} md={6} lg={4} key={p.id}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
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
                    <Link
                      to={`/patients/${p.id}`}
                      className="text-blue-500 mt-2 inline-block"
                    >
                      tahrirlash
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AppointmentsList;
