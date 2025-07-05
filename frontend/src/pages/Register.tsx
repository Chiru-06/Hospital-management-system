import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, TextField, MenuItem, Button, Typography, FormControlLabel, Radio, RadioGroup, Checkbox } from '@mui/material';
import './Register.css';

const slogan = 'Inspiring Hope';

const salutationOptions = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
const genderOptions = ['Male', 'Female', 'Other'];
const nationalityOptions = ['India', 'Other'];
const maritalStatusOptions = ['Single', 'Married', 'Other'];
const idProofOptions = ['Aadhaar', 'PAN', 'Passport', 'Other'];
const stateOptions = ['Select State', 'Karnataka', 'Maharashtra', 'Delhi', 'Other'];
const districtOptions = ['Select District', 'Bangalore', 'Mumbai', 'Delhi', 'Other'];
const cityOptions = ['Select City', 'Bangalore', 'Mumbai', 'Delhi', 'Other'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [receiveReports, setReceiveReports] = React.useState('yes');
  const [receiveAlerts, setReceiveAlerts] = React.useState('yes');
  const [accept, setAccept] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic (API call)
  };

  return (
    <div className="register-container">
      <motion.h1
        className="register-slogan"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {slogan}
      </motion.h1>
      <motion.form
        className="register-form"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onSubmit={handleSubmit}
        style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 32px #0001' }}
      >
        <Typography variant="h4" fontWeight={700} align="center" mb={4}>
          Self Registration Details
        </Typography>
        <Grid container spacing={2}>
          {/* Removed Hospital Location and Preferred Language fields */}
          <Grid item xs={12} sm={3} style={{ display: 'none' }} />
          <Grid item xs={12} sm={3} style={{ display: 'none' }} />
          <Grid item xs={12} sm={3}>
            <TextField select label="Nationality" fullWidth defaultValue="India">
              {nationalityOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField select label="Select Gender" fullWidth defaultValue="" >
              {genderOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Select Salutation" fullWidth defaultValue="" >
              {salutationOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="First Name*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Middle Name" fullWidth />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Last Name*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Mobile Number*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Email ID*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Date of Birth*" type="date" fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Marital Status" fullWidth defaultValue="" >
              {maritalStatusOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="ID Proof" fullWidth defaultValue="" >
              {idProofOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="ID No.*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Country" fullWidth defaultValue="India">
              <MenuItem value="India">India</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Select State" fullWidth defaultValue="">
              {stateOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Select District" fullWidth defaultValue="">
              {districtOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Select City" fullWidth defaultValue="">
              {cityOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField label="Pincode" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address*" fullWidth required multiline minRows={2} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Emergency Contact Name*" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Emergency Contact Number*" fullWidth required />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Consent and Declaration
          </Typography>
          <Typography variant="body2" mb={2}>
            I, the undersigned, declare that the above information provided by me are true to the best of my knowledge and hereby provide my consent to the Medical Staff to provide Medical Care, Treatment, Conduct Investigations and Diagnostic Procedures necessary for the above mentioned individual. I also understand that the Hospital will not be responsible for any loss, damage or theft of any Personal Property/Belongings of Mine/Patient/Visitors within the Hospital Premises, including Patients rooms and Parking area. I agree to follow all the rules and regulations of the Hospital and clear all the expenses incurred for My/Patient treatment on time as per the Terms and Conditions of the Hospital.
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">I would like to receive Self/Patient reports by Email</Typography>
              <RadioGroup row value={receiveReports} onChange={e => setReceiveReports(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">I would like to receive Hospital Info Alerts reports by Email</Typography>
              <RadioGroup row value={receiveAlerts} onChange={e => setReceiveAlerts(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Relations" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Place*" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date/Time" fullWidth value={new Date().toLocaleString()} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={accept} onChange={e => setAccept(e.target.checked)} required />}
                label="Accept the Terms and Conditions"
              />
            </Grid>
          </Grid>
        </Box>
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 4, borderRadius: 3, fontWeight: 700, px: 5, py: 1.5, fontSize: 18 }}>
          Register Me
        </Button>
      </motion.form>
      <div className="register-login-link" style={{ marginTop: 24, textAlign: 'center' }}>
        Already have an account?{' '}
        <span className="login-link" onClick={() => navigate('/login')} style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Login</span>
      </div>
    </div>
  );
};

export default Register;
