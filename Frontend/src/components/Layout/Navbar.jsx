import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <h6 className="text-white">CAR MANAGEMENT</h6>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={show ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
        >
          <GiHamburgerMenu />
        </button>
        <div className={`collapse navbar-collapse ${show ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav d-flex justify-content-center flex-grow-1">
            {isAuthorized && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className="nav-link text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid blue" : "none",
                      color: isActive ? "blue" : "white",
                    })}
                    onClick={() => setShow(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/car/add"
                    className="nav-link text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid blue" : "none",
                      color: isActive ? "blue" : "white",
                    })}
                    onClick={() => setShow(false)}
                  >
                    Add Car
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/car/edit"
                    className="nav-link text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid blue" : "none",
                      color: isActive ? "blue" : "white",
                    })}
                    onClick={() => setShow(false)}
                  >
                    Edit Car
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {!isAuthorized && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className="nav-link text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid blue" : "none",
                      color: isActive ? "blue" : "white",
                    })}
                    onClick={() => setShow(false)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className="nav-link text-white"
                    style={({ isActive }) => ({
                      borderBottom: isActive ? "2px solid blue" : "none",
                      color: isActive ? "blue" : "white",
                    })}
                    onClick={() => setShow(false)}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {isAuthorized && (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-danger-light text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
