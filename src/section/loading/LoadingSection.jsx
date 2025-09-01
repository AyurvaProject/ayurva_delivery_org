import { Box, Typography, LinearProgress } from "@mui/material";
import { keyframes } from "@emotion/react";

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const LoadingSection = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "80vh",
        gap: 2,
      }}
    >
      {/* Animated Logo */}
      <img
        src="./logo.png"
        alt="logo"
        style={{
          width: "100px",
          height: "100px",
          animation: `${bounce} 2s infinite ease-in-out`,
        }}
      />

      {/* Fade-in Text */}
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          animation: `${fadeIn} 1.5s ease-in-out infinite alternate`,
        }}
      >
        Loading...
      </Typography>

      {/* Visible Linear Progress */}
      <LinearProgress
        sx={{
          width: "20%",
          height: 8,
          borderRadius: 5,
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            background: "linear-gradient(90deg, #2196F3, #21CBF3)",
          },
        }}
      />
    </Box>
  );
};

export default LoadingSection;
