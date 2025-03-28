import React from "react";
import {
  Container,
  TextField,
  Avatar,
  Grid,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const UserProfile = () => {
  // Dummy user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    address: "123 Main St, City, Country",
    profilePic: "https://via.placeholder.com/150", // Replace with actual profile URL
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
        <Avatar
          alt="Profile Picture"
          src={user.profilePic}
          sx={{ width: 100, height: 100, margin: "0 auto" }}
        />
        <Typography variant="h6" style={{ marginTop: 10 }}>
          User Profile
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small"
              disabled
              label="First Name"
              value={user.firstName}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small"
              disabled
              label="Last Name"
              value={user.lastName}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              disabled
              label="Email"
              value={user.email}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Phone"
              value={user.phone}
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Address"
              value={user.address}
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            endIcon={<ContactMailIcon />}
            sx={{ margin: "15px 0 ", alignItems: "center" }}
          >
            Send a mail
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;
