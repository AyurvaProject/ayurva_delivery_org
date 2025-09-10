import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LocalPharmacy,
  Person,
  Home,
  CalendarToday,
  AccessTime,
  LocalShipping,
} from "@mui/icons-material";
import { GetPrOrderById } from "../../apis/order/Order";
import CustomSnackbar from "../../component/snackbar/CustomSnackbar";
import LoadingSection from "../loading/LoadingSection";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

const PrOrderDetails = ({ orderId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    loading: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    GetPrOrderById(orderId)
      .then((res) => {
        setOrder(res);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [orderId]);

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

  if (loading) {
    return <LoadingSection />;
  }

  if (!order) return <Typography>No order found.</Typography>;

  return (
    <Box
      sx={{
        // p: 4,
        display: "flex",
        justifyContent: "center",
        bgcolor: "#f9f9f9",
        // minHeight: "100vh",
      }}
    >
      <Card sx={{ width: "100%", boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Order Details
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={order.order_delivery_status.toUpperCase()}
                color={
                  order.order_delivery_status === "pending"
                    ? "warning"
                    : order.order_delivery_status === "rejected"
                    ? "error"
                    : order.order_delivery_status === "accepted"
                    ? "info"
                    : "success"
                }
                sx={{ fontWeight: "bold" }}
              />
            </Stack>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Order Info */}
          <Grid container spacing={3}>
            {/* Order Summary */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                <Typography>
                  <b>Date:</b> {new Date(order.order_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                <Typography>
                  <b>Time:</b> {order.order_time}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalShipping sx={{ mr: 1, color: "primary.main" }} />
                <Typography>
                  <b>Delivery Status:</b>{" "}
                  {order.order_delivery_status.toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalPharmacyIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography>
                  <b>Pharmacy Status:</b>{" "}
                  {order.order_pharmacy_status.toUpperCase()}
                </Typography>
              </Box>
            </Grid>

            {/* Prescription Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Prescription Details
              </Typography>
              <Typography>
                <b>License No:</b> {order.prescriptiondetail.product_license_no}
              </Typography>
              <Typography>
                <b>Dosage:</b> {order.prescriptiondetail.mg}mg /{" "}
                {order.prescriptiondetail.ml}ml
              </Typography>
              <Typography>
                <b>Duration:</b> {order.prescriptiondetail.days} days
              </Typography>
              <Typography>
                <b>Times:</b> {order.prescriptiondetail.times} per day
              </Typography>
              <Typography>
                <b>Instructions:</b> {order.prescriptiondetail.moment_of_take}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* User Info */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Patient Details
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={order.user.user_profile_pic}
              alt={order.user.user_name}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography fontWeight="bold">{order.user.user_name}</Typography>
              <Typography variant="body2">{order.user.user_email}</Typography>
              <Typography variant="body2">{order.user.user_contact}</Typography>
            </Box>
          </Box>

          {/* Address */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Home sx={{ mr: 1, color: "primary.main" }} />
            <Typography>
              {order.address.address_l1}, {order.address.address_l2},{" "}
              {order.address.address_l3}, {order.address.address_district}
            </Typography>
          </Box>
        </CardContent>
      </Card>
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

export default PrOrderDetails;
