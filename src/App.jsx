import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./component/layout/Layout";
import DeliveryPersonList from "./pages/deliverypersons/DeliveryPersonList";
import DeliveryPersonDetails from "./pages/deliverypersons/DeliveryPersonDetails";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/deliverypersons/AddPerson";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/protectedRoute/ProtectedRoute";
import SignUpPage from "./pages/auth/SignUp";
import SignInPage from "./pages/auth/SignIn";
import SinglePerson from "./pages/deliverypersons/SinglePerson";
import PrOrders from "./pages/orders/PrOrders";
import SingleOrder from "./pages/orders/SingleOrder";
import SinglePrOrder from "./pages/orders/SinglePrOrder";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route element={<Layout />}>
              <Route
                element={<ProtectedRoute roles={["deliveryorganization"]} />}
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/addPerson" element={<AddPerson />} />
                <Route path="/personList" element={<DeliveryPersonList />} />
                <Route path="/person/:id" element={<SinglePerson />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<SingleOrder />} />
                <Route path="/prorders" element={<PrOrders />} />
                <Route path="/prorder/:id" element={<SinglePrOrder />} />
                <Route
                  path="/deliveryPersonDetails"
                  element={<DeliveryPersonDetails />}
                />

                <Route path="/orgProfile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
