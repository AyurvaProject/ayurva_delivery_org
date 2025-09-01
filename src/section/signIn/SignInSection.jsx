import SignInFormSection from "./SignInFormSection";
import { Card, Box, Divider, Typography, CardMedia } from "@mui/material";
const SignInSection = () => {
  return (
    <Card
      sx={{
        maxMidth: "100%",
        height: "80%",
        display: "flex",
        flexDirection: "row",
        padding: 4,
      }}
    >
      <Box sx={{ width: "50%", height: "100%" }}>
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
              src="./logo.png"
              alt="logo"
              style={{ width: "100px", Height: "100px" }}
              //style={{ width: "80px", height: "80px" }}
            ></img>
          </Box>
          <Box>
            <Typography variant="h4">Delivery Organization Sign in</Typography>
            <Typography variant="h6" color="gray">
              Fill in the form below to sign in
            </Typography>
            <Divider sx={{ marginTop: "5px" }}></Divider>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <SignInFormSection />
        </Box>
      </Box>

      <CardMedia
        component="img"
        sx={{ width: "50%", backgroundSize: "cover" }}
        image="./loginbg.png"
        alt="loginbg"
      />
    </Card>
  );
};

export default SignInSection;
