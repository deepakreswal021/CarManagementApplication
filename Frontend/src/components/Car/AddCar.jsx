import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const AddCar = () => {
  const [title, setTitle] = useState("");
  const [dealer, setDealer] = useState("");
  const [carType, setCarType] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const { isAuthorized, baseurl } = useContext(Context);
  const navigateTo = useNavigate();

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    setImages(files);
  };

  // Handle form submission
  const handleCarPost = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("dealer", dealer);
    formData.append("carType", carType);
    formData.append("company", company);
    formData.append("description", description);

    // Append images to FormData
    images.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        `${baseurl}/api/v1/car/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
          },
        }
      );
      toast.success(res.data.message);
      navigateTo("/"); // Redirect after successful form submission
    } catch (err) {
      console.error("Error response:", err.response); // Log error details
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    
  };

  return (
    <div className="car_post page py-5">
      <div className="container">
        <h3 className="text-center mb-4">Add New Car</h3>
        <form onSubmit={handleCarPost} className="shadow p-4 rounded bg-white">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Car Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Enter car title"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dealer" className="form-label">Dealer Name</label>
            <input
              type="text"
              id="dealer"
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              className="form-control"
              placeholder="Enter dealer name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="carType" className="form-label">Car Type</label>
            <input
              type="text"
              id="carType"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="form-control"
              placeholder="Enter car type"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="company" className="form-label">Car Company</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="form-control"
              placeholder="Enter car company"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Car Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="Enter a detailed description of the car"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="images" className="form-label">Upload Images (Max 10)</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control"
              required
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-50">
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
