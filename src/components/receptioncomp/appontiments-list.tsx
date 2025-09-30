import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { api } from "../../Service/api";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
}

const AppointmentsList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/patients");
        setPatients(data.items);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Bemorlar ro‘yxati
      </Typography>

      <Grid container spacing={3}>
        {patients.map((p) => (
          <div >
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
              </CardContent>
          
            </Card>
          </div>
        ))}
      </Grid>
    </Box>
  );
};

export default AppointmentsList;
