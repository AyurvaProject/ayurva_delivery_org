import React from "react";
import {
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const severityColors = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

export default function CustomSnackbar({
  open,
  onClose,
  message = "",
  severity = "info",
  autoHideDuration = 6000,
  loading = false,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={loading ? null : autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {loading ? (
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <span>{message || "Loading..."}</span>
          <IconButton size="small" onClick={onClose} sx={{ ml: "auto" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Alert
          severity={severityColors[severity] || "info"}
          variant="filled"
          onClose={onClose}
        >
          {message}
        </Alert>
      )}
    </Snackbar>
  );
}
