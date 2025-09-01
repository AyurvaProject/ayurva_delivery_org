import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
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
  FilledInput,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signupFormSchema } from "../../validation/signUpFormValidation/SignUpFormValidation";
// import { FileInputField } from "../../component/fileUpload/FileInputField";
import { FileUpload } from "../../component/fileUpload/FileUpload";
import { SignUp } from "../../apis/auth/Auth";
import CustomSnackbar from "../../component/snackbar/CustomSnackbar";

const SignUpFormSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    loading: false,
  });
  const navigate = useNavigate();

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
    control,
  } = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      role: "deliveryorganization",
      ayurva_admin_id: 6,
    },
  });

  const handleFileChange = async (fieldName, file) => {
    setValue(fieldName, file);
    await trigger(fieldName);
  };

  const handleClearFile = (fieldName) => {
    setValue(fieldName, null);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (data.delivery_org_register_document) {
        formData.append("files", data.delivery_org_register_document);
      }

      if (data.user_name) {
        formData.append("user_name", data.user_name);
      }

      if (data.password) {
        formData.append("password", data.password);
      }

      if (data.delivery_org_name) {
        formData.append("delivery_org_name", data.delivery_org_name);
      }

      formData.append("ayurva_admin_id", data.ayurva_admin_id || 6);

      const response = await SignUp(formData);
      console.log(response);
      showSnackbar(
        "success",
        false,
        "Success. You can proceed after the admin verifies your account."
      );
      reset();
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showSnackbar(
          "error",
          false,
          error.response.data.message ||
            "Something Went Wrong. Please try Again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  return (
    <Box
      sx={{ maxWidth: "100%" }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Basic Information
      </Typography>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
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
        <TextField
          label="Organization Name"
          variant="filled"
          fullWidth
          {...register("delivery_org_name")}
          error={!!errors.delivery_org_name}
          helperText={errors.delivery_org_name?.message}
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

        <FormControl
          variant="filled"
          fullWidth
          error={!!errors.confirmPassword}
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
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <FilledInput
            size="small"
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
          {errors.confirmPassword && (
            <FormHelperText error>
              {errors.confirmPassword.message}
            </FormHelperText>
          )}
        </FormControl>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Required Documents
      </Typography>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 2 }}
      >
        <FileUpload
          name="delivery_org_register_document"
          label="Profile Picture"
          description="Upload another image of yourself (JPEG, PNG, WEBP)"
          control={control}
          maxSize={5 * 1024 * 1024}
          mediaType="image"
          enableCrop={false}
          onFileChange={(file) =>
            handleFileChange("delivery_org_register_document", file)
          }
          error={errors.delivery_org_register_document?.message}
          standalone={false}
        />
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

export default SignUpFormSection;
