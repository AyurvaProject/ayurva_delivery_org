import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { deliveryPersonSignupFormSchema } from "../../validation/deliveryPersonFormValidation/DeliveryPersonAddFormValidation";
import { GetCurrentUser } from "../../apis/auth/Auth";
import { SignUpDeliveryPerson } from "../../apis/deliveryPerson/DeliveryPerson";
import { FileUpload } from "../../component/fileUpload/FileUpload";
import CustomSnackbar from "../../component/snackbar/CustomSnackbar";

const customTextFieldStyles = {
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
};

const DeliveryPersonAddForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    resolver: zodResolver(deliveryPersonSignupFormSchema),
    defaultValues: {
      delivery_org_id: Number(GetCurrentUser()?.id),
    },
  });

  console.log("errors", errors);
  console.log("user", GetCurrentUser());

  const handleFileChange = async (fieldName, file) => {
    setValue(fieldName, file);
    await trigger(fieldName);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (data.delivery_person_img) {
        formData.append("files", data.delivery_person_img);
      }
      if (data.delivery_person_name) {
        formData.append("delivery_person_name", data.delivery_person_name);
      }
      if (data.delivery_person_user_name) {
        formData.append(
          "delivery_person_user_name",
          data.delivery_person_user_name
        );
      }
      if (data.delivery_person_password) {
        formData.append(
          "delivery_person_password",
          data.delivery_person_password
        );
      }
      if (data.delivery_person_nic_no) {
        formData.append("delivery_person_nic_no", data.delivery_person_nic_no);
      }
      formData.append("delivery_org_id", Number(GetCurrentUser()?.id));

      await SignUpDeliveryPerson(formData);
      showSnackbar("success", false, "Delivery Person Added successfully!");
      reset();
      navigate("/");
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
  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Add Delivery Person
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{ maxWidth: "100%" }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          <FileUpload
            name="delivery_person_img"
            label="Profile Picture"
            description="Upload a clear profile picture (JPEG, PNG, WEBP)"
            control={control}
            maxSize={5 * 1024 * 1024}
            mediaType="image"
            enableCrop={true}
            cropAspectRatio={1 / 1}
            onFileChange={(file) =>
              handleFileChange("delivery_person_img", file)
            }
            error={errors.delivery_person_img?.message}
            initialPreview={null}
            standalone={false}
          />
          <Box sx={{ gridColumn: "span 2" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              <TextField
                label="User Name"
                variant="filled"
                fullWidth
                size="small"
                {...register("delivery_person_user_name")}
                error={!!errors.delivery_person_user_name}
                helperText={errors.delivery_person_user_name?.message}
                sx={customTextFieldStyles}
                // disabled
              />
              <TextField
                label="Name"
                variant="filled"
                fullWidth
                size="small"
                {...register("delivery_person_name")}
                error={!!errors.delivery_person_name}
                helperText={errors.delivery_person_name?.message}
                sx={customTextFieldStyles}
                // disabled
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
                  {...register("delivery_person_password")}
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
                {errors.delivery_person_password && (
                  <FormHelperText error>
                    {errors.delivery_person_password.message}
                  </FormHelperText>
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
                <InputLabel htmlFor="confirmPassword">
                  Confirm Password
                </InputLabel>
                <FilledInput
                  size="small"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
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
              <TextField
                label="NIC Number"
                variant="filled"
                fullWidth
                size="small"
                {...register("delivery_person_nic_no")}
                error={!!errors.delivery_person_nic_no}
                helperText={errors.delivery_person_nic_no?.message}
                sx={customTextFieldStyles}
                disabled={isSubmitting}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginTop: 4,
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

export default DeliveryPersonAddForm;
