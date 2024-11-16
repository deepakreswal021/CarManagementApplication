import "./App.css";
import AddCar from "./components/Car/AddCar";
import CarDetails from "./components/Car/carDetails";
import Footer from "./components/Layout/Footer";
import Login from "./components/Auth/Login";
import MyCars from "./components/Car/EditCar";
import Navbar from "./components/Layout/Navbar";
import NotFound from "./components/NotFound/NotFound";
import React, { useContext, useEffect } from "react";
import Register from "./components/Auth/Register";
import SearchCars from "./components/Car/SearchCar";
import axios from "axios";
import dotenv from "dotenv";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Context } from "./main";

// import Cars from "./components/Car/Cars";

// import ProtectedRoute from "./components/ProtectedRoute";
dotenv.config();
const ProtectedRoute = ({ isAuthorized, children }) => {
  return isAuthorized ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser, baseurl } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/v1/user/getuser`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <BrowserRouter>
      <div className="page-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthorized={isAuthorized}>
                  <SearchCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/car/:id"
              element={
                <ProtectedRoute isAuthorized={isAuthorized}>
                  <CarDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/car/add"
              element={
                <ProtectedRoute isAuthorized={isAuthorized}>
                  <AddCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/car/edit"
              element={
                <ProtectedRoute isAuthorized={isAuthorized}>
                  <MyCars />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
