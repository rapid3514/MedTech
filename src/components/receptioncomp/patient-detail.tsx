import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { api } from "../../Service/api";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await api.get(`/patients/${id}`);
        setPatient(data);
      } catch (error) {
        console.error("Patientni olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems={'center'} mt={5}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  if (!patient)
    return (
      <Typography 
        variant="h5" 
        color="error" 
        align="center" 
        mt={5} 
        sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}
      >
        Bemor topilmadi
      </Typography>
    );

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: { xs: '1rem', md: '1.1rem' },
            minWidth: { xs: 120, md: 150 }
          }}
        >
          Orqaga
        </Button>
      </Box>

      {/* Asosiy content: Responsive Grid, to'liq ekran uchun maxWidth olib tashlandi */}
      <Grid container spacing={4}>
        {/* Chap taraf: Asosiy ma'lumotlar, responsive */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, height: "100%", minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                {patient.firstName} {patient.lastName}
              </Typography>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 2
                }}
              >
                <strong>Jinsi:</strong> {patient.gender}
              </Typography>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 2
                }}
              >
                <strong>Telefon:</strong> {patient.phone}
              </Typography>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  mb: 2
                }}
              >
                <strong>Email:</strong> {patient.email || "Mavjud emas"}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mt: 3, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6
                }}
              >
                <strong>Yaratilgan:</strong> {new Date(patient.createdAt).toLocaleString()}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.6
                }}
              >
                <strong>Yangilangan:</strong> {new Date(patient.updatedAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* O'ng taraf: Notes alohida, kattalashtirilgan */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, height: "100%", minHeight: 400 }}>
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                  fontWeight: 'bold',
                  mb: 2,
                  color: 'primary.main'
                }}
              >
                Kasallik tarixi
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  overflow: "auto",
                  minHeight: 250,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.7
                }}
              >
                <Typography variant="body1">
                  {patient.notes || "Ma'lumot mavjud emas"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDetails;