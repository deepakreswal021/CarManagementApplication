import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

// import { FaPhoneFlip } from "react-icons/fa6";
// import { FaRegUser } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser,baseurl } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    // console.log("inside error handler");
    try {
      const  data  = await axios.post(
        `${baseurl}/api/v1/user/register`,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log("yha tk aa gya bhai");
      // console.log(data);
      // console.log(data.data);
      toast.success(data.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setIsAuthorized(true);
    } catch (error) {
      const msg = await error.response.data.message;
      toast.error(msg);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Create a new account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Name</label>
              <div>
                <input
                  type="text"
                  placeholder="Deepak"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="dr@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleRegister}>
              Register
            </button>
            {/* <Link to={"/login"}>Login Now</Link> */}
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Register;
