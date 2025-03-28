import React from "react";
import { Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";

// const logo = require("../../assets/img/logo.png").default;
import logo from "../../assets/img/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 300;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <SpaceDashboardIcon />,
      path: "/",
    },
    {
      text: "Add a delivery Person",
      icon: <PersonAddIcon />,
      path: "/addPerson",
    },
    { text: "Delivery person  List", icon: <ListIcon />, path: "/personList" },

    {
      text: "Delivery Person Details",
      icon: <DescriptionIcon />,
      path: "/deliveryPersonDetails",
    },

    {
      text: "Orders",
      icon: <HomeRepairServiceIcon />,
      path: "/orders",
    },
    {
      text: "Organization Profile",
      icon: <CorporateFareIcon />,
      path: "/orgProfile",
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      {/* <Divider /> */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                color: "black",
                borderRadius: 2,
                transition: "background-color 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "blue", // Change background color to blue on hover
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minWidth: "100%" }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        // color="primary"
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          // paddingLeft: 5,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.text.layoutPrimary,
          },
          bgcolor: "black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "Flex-start",
            bgcolor: "white",
            borderRadius: 5,
            boxShadow: 5,
            margin: "5%",
            height: "100%",
          }}
        >
          <Avatar
            alt="logo"
            src={logo}
            sx={{ width: "100px", height: "100px", mt: 2 }}
          />
          <Typography
            variant="h5"
            sx={{
              mt: 1,
              background: "linear-gradient(45deg, #004aad, #38b6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 650,
            }}
          >
            Ayurva
          </Typography>
          <Divider />
          {drawer}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: "80%",
          maxWidth: "100%",
        }}
      >
        <AppBar
          position="fixed"
          //   color="primary"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: `rgba(0, 0, 0, 0)`,
            boxShadow: "none",
            color: theme.palette.text.layoutSecondary,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2, display: { sm: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              color="black"
              sx={{ alignContent: "center", alignItems: "flex-start" }}
            >
              Delivery persons
            </Typography>

            <Button
              endIcon={<LogoutIcon />}
              sx={{ ml: "auto", textTransform: "none" }}
              onClick={() => navigate("/login")}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, mt: 8, minWidth: "100%" }}
        >
          <Outlet style={{ maxWidth: "100%" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
