import React, { useEffect, useState } from "react";
import DataGridComponent from "../../component/datagrid/DataGrid";
import {
  GetOrdersByDeliveryOrg,
  GetPrescriptionOrdersByDeliveryOrg,
} from "../../apis/order/Order";
import {
  Box,
  Button,
  Typography,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../component/snackbar/CustomSnackbar";
import LoadingSection from "../loading/LoadingSection";
const PrOrderListSection = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    GetPrescriptionOrdersByDeliveryOrg().then((response) => {
      setOrders(response);
      setLoading(false);
    });
  }, []);

  //   const fetchData = () => {
  //     setLoading(true);
  //     GetDeliveryPersonsByDeliveryOrgId().then((response) => {
  //       setDeliveryPersons(response);
  //       setLoading(false);
  //     });
  //   };

  //   const handleDelete = (id) => {
  //     setIsDeleting(true);
  //     DeleteDeliveryPerson(id).then((response) => {
  //       showSnackbar("success", false, "Delivery person deleted successfully!");
  //       setIsDeleting(false);
  //       fetchData();
  //     });
  //   };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "product_name", headerName: "Product", flex: 0.5 },
    { field: "user_name", headerName: "User Name", flex: 0.5 },
    {
      field: "pharmacy_status",
      headerName: "Pharmacy Status",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={
            params.value == "pending"
              ? "Pending"
              : params.value == "completed"
              ? "Completed"
              : "Cancelled"
          }
          color={
            params.value == "pending"
              ? "warning"
              : params.value == "completed"
              ? "success"
              : "error"
          }
          variant="filled"
          size="small"
        />
      ),
    },
    {
      field: "delivery_status",
      headerName: "Delivery Status",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={
            params.value == "pending"
              ? "Pending"
              : params.value == "completed"
              ? "Completed"
              : "Cancelled"
          }
          color={
            params.value == "pending"
              ? "warning"
              : params.value == "completed"
              ? "success"
              : "error"
          }
          variant="filled"
          size="small"
        />
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", my: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigate(`/prorder/${params.row.id}`);
            }}
          >
            View
          </Button>
        </Stack>
      ),
    },
  ];

  const rows = orders.map((order) => ({
    id: order.order_id,
    product_name: order.prescriptiondetail.product_license_no,
    user_name: order.user.user_name,
    pharmacy_status: order.order_pharmacy_status,
    delivery_status: order.order_delivery_status,
  }));

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{}}>
          Orders
        </Typography>
      </Box>

      <DataGridComponent columns={columns} rows={rows} />
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

export default PrOrderListSection;
