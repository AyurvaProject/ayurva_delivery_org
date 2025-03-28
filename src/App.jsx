import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./component/layout/Layout";
import DeliveryPersonList from "./pages/deliverypersons/DeliveryPersonList";
import DeliveryPersonDetails from "./pages/deliverypersons/DeliveryPersonDetails";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/deliverypersons/AddPerson";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/addPerson" element={<AddPerson />} />
            <Route path="/personList" element={<DeliveryPersonList />} />

            <Route
              path="/deliveryPersonDetails"
              element={<DeliveryPersonDetails />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orgProfile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
