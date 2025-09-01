import { signInSchema } from "../../validation/signInFormValidation/SignInFormValidation";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  FormHelperText,
  Typography,
  FilledInput,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import CustomSnackbar from "../../component/snackbar/CustomSnackbar";
import { useAuth } from "../../context/AuthContext";

const SignInFormSection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    loading: false,
  });

  const showSnackbar = (severity, loading = false, message) => {
    setSnackbar({
      open: true,
      message: loading ? "Processing..." : message,
      severity,
      loading,
    });

    if (!loading) {
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      role: "deliveryorganization",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await login(data.user_name, data.password);

      navigate("/");
    } catch (error) {
      showSnackbar("error", false, error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box
      sx={{ width: "100%" }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 2 }}
      >
        <TextField
          label="Username"
          variant="filled"
          fullWidth
          {...register("user_name")}
          error={!!errors.user_name}
          helperText={errors.user_name?.message}
          size="small"
          sx={{
            "& .MuiFilledInput-root": {
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
            },
          }}
        />
        <FormControl
          variant="filled"
          fullWidth
          error={!!errors.password}
          sx={{
            "& .MuiFilledInput-root": {
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
            },
          }}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <FilledInput
            id="password"
            size="small"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && (
            <FormHelperText error>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
        <Box sx={{ mt: 0 }}>
          <Typography variant="caption">
            Don't have an account?{" "}
            <Box
              component="span"
              sx={{
                cursor: "pointer",
                color: "text.primary",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                navigate("/signUp");
              }}
            >
              Click here
            </Box>
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={() => reset()}
            disabled={isSubmitting}
            sx={{ width: "160px" }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={12} /> : null}
            sx={{ width: "160px" }}
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </Button>
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
        loading={snackbar.loading}
      />
    </Box>
  );
};

export default SignInFormSection;
