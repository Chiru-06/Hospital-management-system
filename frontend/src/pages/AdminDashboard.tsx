import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  keyframes,
  styled,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  People,
  CalendarToday,
  LocalHospital,
  TrendingUp,
  AccessTime,
  Person,
  Event,
  CurrencyRupee,
} from '@mui/icons-material';
import api from '../api/axios';

interface DashboardStats {
  totalPatients: number;
  todaysAppointments: number;
  activeDoctors: number;
  monthlyRevenue: number;
  newPatientsThisMonth: number;
  appointmentCompletionRate: number;
  patientDemographics: {
    adults: number;
    seniors: number;
    children: number;
  };
  recentActivities: Array<{
    type: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    '& .MuiCardContent-root': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.default,
  marginRight: theme.spacing(2),
  animation: `${pulse} 2s infinite`,
}));

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    transition: 'transform 0.3s ease-in-out',
  },
}));

const ActivityItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todaysAppointments: 0,
    activeDoctors: 0,
    monthlyRevenue: 0,
    newPatientsThisMonth: 0,
    appointmentCompletionRate: 0,
    patientDemographics: {
      adults: 0,
      seniors: 0,
      children: 0,
    },
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsResponse, appointmentsResponse, doctorsResponse, billingResponse] = await Promise.all([
          api.get('/patients'),
          api.get('/appointments'),
          api.get('/doctors'),
          api.get('/billing'),
        ]);

        const totalPatients = patientsResponse.data.length;
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const newPatientsThisMonth = patientsResponse.data.filter((patient: any) => {
          const patientDate = new Date(patient.created_at);
          return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear;
        }).length;

        const totalAppointments = appointmentsResponse.data.length;
        const completedAppointments = appointmentsResponse.data.filter(
          (appointment: any) => appointment.status === 'completed'
        ).length;
        const appointmentCompletionRate = totalAppointments > 0 
          ? Math.round((completedAppointments / totalAppointments) * 100) 
          : 0;

        const patientDemographics = {
          adults: Math.round(totalPatients * 0.65),
          seniors: Math.round(totalPatients * 0.25),
          children: Math.round(totalPatients * 0.10),
        };

        const recentActivities = [
          ...appointmentsResponse.data.slice(0, 4).map((appointment: any) => ({
            type: 'Appointment',
            description: `Appointment with ${appointment.patient_name}`,
            timestamp: new Date(appointment.date).toLocaleTimeString(),
            icon: 'Event',
          })),
          ...patientsResponse.data.slice(0, 2).map((patient: any) => ({
            type: 'Patient',
            description: `New patient: ${patient.name}`,
            timestamp: new Date(patient.created_at).toLocaleTimeString(),
            icon: 'Person',
          })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
         .slice(0, 4);

        // Calculate total billing amount for the current month
        const totalBilling = billingResponse.data
          .filter((bill: any) => {
            const billDate = new Date(bill.created_at || bill.date);
            return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
          })
          .reduce((total: number, bill: any) => total + (bill.total_amount || 0), 0);

        setStats({
          totalPatients,
          todaysAppointments: appointmentsResponse.data.filter(
            (appointment: any) => appointment.date === today
          ).length,
          activeDoctors: doctorsResponse.data.length,
          monthlyRevenue: totalBilling,
          newPatientsThisMonth,
          appointmentCompletionRate,
          patientDemographics,
          recentActivities,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: <People sx={{ fontSize: 30, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      title: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: <CalendarToday sx={{ fontSize: 30, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Active Doctors',
      value: stats.activeDoctors,
      icon: <LocalHospital sx={{ fontSize: 30, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: <CurrencyRupee sx={{ fontSize: 30, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6" color="text.secondary">
          Loading dashboard statistics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconWrapper>
                    {card.icon}
                  </IconWrapper>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    color: card.color,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Patient Statistics
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      New Patients This Month
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h4" sx={{ mr: 1 }}>
                        {stats.newPatientsThisMonth}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        +{Math.round((stats.newPatientsThisMonth / stats.totalPatients) * 100)}%
                      </Typography>
                    </Box>
                    <StyledProgressBar 
                      variant="determinate" 
                      value={Math.round((stats.newPatientsThisMonth / stats.totalPatients) * 100)} 
                      sx={{ 
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main,
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Appointment Completion Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h4" sx={{ mr: 1 }}>
                        {stats.appointmentCompletionRate}%
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        +5%
                      </Typography>
                    </Box>
                    <StyledProgressBar 
                      variant="determinate" 
                      value={stats.appointmentCompletionRate} 
                      sx={{ 
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main,
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Patient Demographics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56, mx: 'auto', mb: 1 }}>
                        {Math.round((stats.patientDemographics.adults / stats.totalPatients) * 100)}%
                      </Avatar>
                      <Typography variant="body2">Adults</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 56, height: 56, mx: 'auto', mb: 1 }}>
                        {Math.round((stats.patientDemographics.seniors / stats.totalPatients) * 100)}%
                      </Avatar>
                      <Typography variant="body2">Seniors</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.success.main, width: 56, height: 56, mx: 'auto', mb: 1 }}>
                        {Math.round((stats.patientDemographics.children / stats.totalPatients) * 100)}%
                      </Avatar>
                      <Typography variant="body2">Children</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccessTime sx={{ fontSize: 30, color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Activities
                </Typography>
              </Box>
              
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {stats.recentActivities.map((activity, index) => (
                  <ActivityItem key={index}>
                    <ListItemIcon>
                      {activity.icon === 'Event' ? (
                        <Event sx={{ color: theme.palette.primary.main }} />
                      ) : (
                        <Person sx={{ color: theme.palette.secondary.main }} />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.description} 
                      secondary={activity.timestamp} 
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                    />
                  </ActivityItem>
                ))}
              </List>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
