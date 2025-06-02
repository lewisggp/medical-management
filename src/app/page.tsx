import { Box, Button, Container, Typography, Stack, Paper } from '@mui/material';
import Link from 'next/link';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function Home() {
  const features = [
    {
      icon: <MedicalServicesIcon fontSize="large" color="primary" />,
      title: 'Gestión de Doctores',
      description: 'Administra el personal médico, especialidades y horarios de manera eficiente.'
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Control de Pacientes',
      description: 'Mantén historiales médicos completos y organizados para cada paciente.'
    },
    {
      icon: <ScheduleIcon fontSize="large" color="primary" />,
      title: 'Agenda de Citas',
      description: 'Programa y gestiona citas médicas con recordatorios automáticos.'
    },
    {
      icon: <HowToRegIcon fontSize="large" color="primary" />,
      title: 'Acceso Seguro',
      description: 'Sistema de autenticación protegido para doctores y personal autorizado.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Clinica Del Adulto Mayor
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
            Sistema Integral de Gestión Médica
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button component={Link} href="/login" variant="contained" color="info" size="large">
              Iniciar Sesión
            </Button>
            <Button component={Link} href="/register" variant="outlined" color="inherit" size="large">
              Registrarse
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Typography variant="h4" component="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Características Principales
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr 1fr'
            },
            gap: 4
          }}
        >
          {features.map((feature, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          backgroundColor: '#f5f5f5',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body1" color="text.secondary">
            © {new Date().getFullYear()} Clinica Del Adulto Mayor - Sistema de Gestión Médica
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Todos los derechos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
