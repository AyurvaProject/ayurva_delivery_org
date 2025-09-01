import React, { useEffect, useState } from "react";
import DataGridComponent from "../../component/datagrid/DataGrid";
import {
  GetDeliveryPersonsByDeliveryOrgId,
  DeleteDeliveryPerson,
} from "../../apis/deliveryPerson/DeliveryPerson";
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
const PersonListSection = () => {
  const navigate = useNavigate();
  const [deliveryPersons, setDeliveryPersons] = useState([]);
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
    GetDeliveryPersonsByDeliveryOrgId().then((response) => {
      setDeliveryPersons(response);
      setLoading(false);
    });
  }, []);

  const fetchData = () => {
    setLoading(true);
    GetDeliveryPersonsByDeliveryOrgId().then((response) => {
      setDeliveryPersons(response);
      setLoading(false);
    });
  };

  const handleDelete = (id) => {
    setIsDeleting(true);
    DeleteDeliveryPerson(id).then((response) => {
      showSnackbar("success", false, "Delivery person deleted successfully!");
      setIsDeleting(false);
      fetchData();
    });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "image",
      headerName: "Image",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="image"
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "delivery_person_user_name", headerName: "User Name", flex: 0.5 },
    { field: "delivery_person_name", headerName: "Name", flex: 0.5 },
    { field: "delivery_person_nic_no", headerName: "NIC", flex: 0.5 },
    {
      field: "active",
      headerName: "Active",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value === true ? "success" : "error"}
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
              navigate(`/person/${params.row.id}`);
            }}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              handleDelete(params.row.id);
            }}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  const rows = deliveryPersons.map((person) => ({
    id: person.id,
    image: person.delivery_person_img,
    delivery_person_user_name: person.delivery_person_user_name,
    delivery_person_name: person.delivery_person_name,
    delivery_person_nic_no: person.delivery_person_nic_no,
    active: person.delivery_person_active_status,
  }));

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" sx={{}}>
          Delivery Persons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/addPerson");
          }}
        >
          Add Person
        </Button>
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

export default PersonListSection;
