import { Box, Divider, Typography, Card } from "@mui/material";
import logo from "../../assets/img/logo.png";
import { Height } from "@mui/icons-material";
import SignUpFormSection from "./SignUpFormSection";

const SignUpSection = () => {
  return (
    <Card
      sx={{
        maxMidth: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 4,
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          display: "flex",
          marginBottom: 5,
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <img
            src={logo}
            alt="logo"
            style={{ width: "100px", Height: "100px" }}
            //style={{ width: "80px", height: "80px" }}
          ></img>
        </Box>
        <Box>
          <Typography variant="h4">Delivery Organization Signup</Typography>
          <Typography variant="h6" color="gray">
            Please fill in the form below to register as a delivery
            organization.
          </Typography>
          <Divider sx={{ marginTop: "5px" }}></Divider>
        </Box>
      </Box>
      <Box sx={{ maxWidth: "100%" }}>
        <SignUpFormSection />
      </Box>
    </Card>
  );
};

export default SignUpSection;
