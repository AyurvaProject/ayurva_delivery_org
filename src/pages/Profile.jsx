import React from "react";
import {
  Container,
  TextField,
  Avatar,
  Grid,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";

const Profile = () => {
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
          Organization Profile
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small"
              label="First Name"
              value={user.firstName}
              fullWidth
              InputProps={{ readOnly: false }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small"
              label="Last Name"
              value={user.lastName}
              fullWidth
              InputProps={{ readOnly: false }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Email"
              value={user.email}
              fullWidth
              InputProps={{ readOnly: false }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Phone"
              value={user.phone}
              fullWidth
              InputProps={{ readOnly: false }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Address"
              value={user.address}
              fullWidth
              InputProps={{ readOnly: false }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            endIcon={<PublishIcon />}
            sx={{ margin: "15px 0 2px" }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
