import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WeeklyCalendar from './Boop';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(10),
  marginTop: theme.spacing(4),
}));

const SprayOrderForm = ({ userRole, userId }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    dateTime: '',
    location: '',
    farmerId: '',
  });
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupMethod, setLookupMethod] = useState('phone');
  const [farmerUserId, setFarmerUserId] = useState('');
  const baseURL = 'http://localhost:8080/api';

  useEffect(() => {
    const cost = parseFloat(formData.area) * 30000;
    setTotalCost(cost);
  }, [formData.area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeSlotSelect = (date, time) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: `${format(date, 'yyyy-MM-dd')}T${time}`,
    }));
  };

  const handleLookupMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setLookupMethod(newMethod);
      setFarmerDetails(null);
      setIsManualEntry(false);
      setError('');
    }
  };

  const handleFarmerLookup = async (e) => {
    e.preventDefault();
    setError('');
    setFarmerDetails(null);
    setIsManualEntry(false);
    setLoading(true);

    try {
      let response;
      if (lookupMethod === 'phone') {
        response = await axios.get(`${baseURL}/user/${userId}/receptionist/farmers/search`, {
          params: { phoneNumber: farmerPhone }
        });
      } else {
        response = await axios.get(`${baseURL}/user/${userId}/receptionist/farmers/${farmerUserId}`);
      }

      if (response.data) {
        setFarmerDetails(response.data);
        setFormData((prevData) => ({
          ...prevData,
          location: response.data.homeAddress || '',
          farmerId: response.data.id || '',
        }));
      } else {
        throw new Error('No farmer data received');
      }
    } catch (err) {
      console.error('Error fetching farmer details:', err);
      let errorMessage = `No farmer found with this ${lookupMethod === 'phone' ? 'phone number' : 'user ID'}. Please enter farmer details manually.`;
      if (err.response && err.response.status !== 404) {
        errorMessage = 'An error occurred while fetching farmer details. Please try again.';
      }
      setError(errorMessage);
      setIsManualEntry(true);
      setFarmerDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = (e) => {
    e.preventDefault();
    setIsManualEntry(true);
    setFarmerDetails({
      id: null,
      firstName: '',
      lastName: '',
      emailAddress: '',
      homeAddress: '',
      phoneNumber: farmerPhone,
    });
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setFarmerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = userRole === 'FARMER'
        ? `${baseURL}/user/${userId}/farmer/orders`
        : `${baseURL}/user/${userId}/receptionist/orders`;

      const sprayOrderRequest = {
        farmer: {
          id: userRole === 'FARMER' ? parseInt(userId) : parseInt(formData.farmerId)
        },
        cropType: formData.cropType,
        area: parseFloat(formData.area),
        dateTime: formData.dateTime,
        cost: totalCost,
        location: formData.location,
        spraySession: {
          date: format(new Date(formData.dateTime), 'yyyy-MM-dd'),
          startTime: format(new Date(formData.dateTime), 'HH:mm:ss'),
          endTime: format(
            new Date(new Date(formData.dateTime).getTime() + 60 * 60 * 1000),
            'HH:mm:ss'
          )
        }
      };

      console.log('Order details:', sprayOrderRequest);
      console.log('API URL:', url);

      const response = await axios.post(url, sprayOrderRequest);
      setSuccess('Order created successfully!');
      setFormData({
        cropType: '',
        area: '',
        dateTime: '',
        location: '',
        farmerId: '',
      });
      setFarmerDetails(null);
      setFarmerPhone('');
      setIsManualEntry(false);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response && error.response.data) {
        setError(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data)
        );
      } else {
        setError('An error occurred while creating the order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container maxWidth="lg">
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom>
            Create Spray Order
          </Typography>
    
          {userRole === 'RECEPTIONIST' && (
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Farmer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <ToggleButtonGroup
                    value={lookupMethod}
                    exclusive
                    onChange={handleLookupMethodChange}
                    aria-label="farmer lookup method"
                    fullWidth
                  >
                    <ToggleButton value="phone" aria-label="phone number">
                      Phone Number
                    </ToggleButton>
                    <ToggleButton value="userId" aria-label="user id">
                      User ID
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={9}>
                  {lookupMethod === 'phone' ? (
                    <TextField
                      fullWidth
                      type="tel"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="Enter farmer's phone number"
                      variant="outlined"
                      required
                      label="Phone Number"
                    />
                  ) : (
                    <TextField
                      fullWidth
                      type="text"
                      value={farmerUserId}
                      onChange={(e) => setFarmerUserId(e.target.value)}
                      placeholder="Enter farmer's user ID"
                      variant="outlined"
                      required
                      label="User ID"
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    onClick={handleFarmerLookup}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ height: '100%' }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Fetch Details'}
                  </Button>
                </Grid>
                {!farmerDetails && !isManualEntry && (
                  <Grid item xs={12}>
                    <Button
                      onClick={handleManualEntry}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                    >
                      Enter Farmer Details Manually
                    </Button>
                  </Grid>
                )}
              </Grid>
    
              {isManualEntry && (
                <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Enter Farmer Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="firstName"
                        label="First Name"
                        value={farmerDetails?.firstName || ''}
                        onChange={handleManualInputChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        value={farmerDetails?.lastName || ''}
                        onChange={handleManualInputChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="emailAddress"
                        label="Email Address"
                        type="email"
                        value={farmerDetails?.emailAddress || ''}
                        onChange={handleManualInputChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="homeAddress"
                        label="Home Address"
                        value={farmerDetails?.homeAddress || ''}
                        onChange={handleManualInputChange}
                        variant="outlined"
                        required
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}
    
              {farmerDetails && !isManualEntry && (
                <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: 'success.light' }}>
                  <Typography variant="h6" gutterBottom>
                    Farmer Details
                  </Typography>
                  <Typography>
                    <strong>Name:</strong> {farmerDetails.firstName} {farmerDetails.lastName}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {farmerDetails.emailAddress}
                  </Typography>
                  <Typography>
                    <strong>Address:</strong> {farmerDetails.homeAddress}
                  </Typography>
                </Paper>
              )}
            </Paper>
          )}
    
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="crop-type-label">Crop Type</InputLabel>
                  <Select
                    labelId="crop-type-label"
                    id="cropType"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    label="Crop Type"
                  >
                    <MenuItem value="">
                      <em>Select crop type</em>
                    </MenuItem>
                    <MenuItem value="FRUIT">Fruit</MenuItem>
                    <MenuItem value="CEREAL">Cereal</MenuItem>
                    <MenuItem value="VEGETABLE">Vegetable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
    
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  id="area"
                  name="area"
                  label="Farmland Area (decare)"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  variant="outlined"
                />
              </Grid>
    
              <Grid item xs={12}>
                <WeeklyCalendar onSelectTimeSlot={handleTimeSlotSelect} />
              </Grid>
    
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="dateTime"
                  name="dateTime"
                  label="Selected Date and Time"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
    
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
    
              <Grid item xs={12}>
                <Typography variant="h6">
                  Total Cost: {totalCost.toLocaleString()} VND
                </Typography>
              </Grid>
    
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Order'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
    
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
    
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    );
};

export default SprayOrderForm;
