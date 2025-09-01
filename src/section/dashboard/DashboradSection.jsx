import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import LoadingSection from "../loading/LoadingSection";
import {
  GetOrdersByDeliveryOrg,
  GetPrescriptionOrdersByDeliveryOrg,
} from "../../apis/order/Order";
import { GetDeliveryPersonsByDeliveryOrgId } from "../../apis/deliveryPerson/DeliveryPerson";

export default function DeliveryOrgDashboard({ orgName }) {
  const [orders, setOrders] = useState([]);
  const [prescriptionOrders, setPrescriptionOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      GetOrdersByDeliveryOrg(),
      GetPrescriptionOrdersByDeliveryOrg(),
      GetDeliveryPersonsByDeliveryOrgId(),
    ]).then(([ordersRes, prescriptionRes, deliveryRes]) => {
      setOrders(ordersRes);
      setPrescriptionOrders(prescriptionRes);
      setDeliveryPersons(deliveryRes);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSection />;
  }

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: <InventoryIcon fontSize="large" color="primary" />,
      color: "primary.main",
    },
    {
      label: "Prescription Orders",
      value: prescriptionOrders.length,
      icon: <AssignmentIcon fontSize="large" color="success" />,
      color: "success.main",
    },
    {
      label: "Delivery Persons",
      value: deliveryPersons.length,
      icon: <PeopleIcon fontSize="large" color="warning" />,
      color: "warning.main",
    },
  ];

  return (
    <Box sx={{ minHeight: "80vh", p: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          {orgName} Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back! Here’s an overview of your delivery operations 🚚
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                transition: "0.3s",
                "&:hover": { boxShadow: 10, transform: "translateY(-4px)" },
              }}
            >
              <Box mb={2}>{stat.icon}</Box>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {stat.label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={stat.color}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
