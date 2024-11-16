import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const MyCars = () => {
  const [myCars, setMyCars] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, baseurl } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get(`${baseurl}/api/v1/car/getall`, {
          withCredentials: true,
        });
        setMyCars(data.myCars);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyCars([]);
      }
    };
    fetchCars();
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const handleEnableEdit = (carId) => {
    setEditingMode(carId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateCar = async (carId) => {
    const updatedCar = myCars.find((car) => car._id === carId);
    try {
      const res = await axios.put(
        `${baseurl}/api/v1/car/update/${carId}`,
        updatedCar,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      const res = await axios.delete(
        `${baseurl}/api/v1/car/delete/${carId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setMyCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteImage = async (carId, imageUrl) => {
    try {
      const res = await axios.delete(`${baseurl}/api/v1/car/delete-image`, {
        withCredentials: true,
        data: { carId, imageUrl },
      });
      toast.success(res.data.message);
      setMyCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId
            ? { ...car, images: car.images.filter((img) => img !== imageUrl) }
            : car
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  const handleUploadImages = async (carId, files) => {
    const car = myCars.find((car) => car._id === carId);

    if (car.images.length + files.length > 10) {
      toast.error("Total number of images cannot exceed 10.");
      return;
    }

    const formData = new FormData();
    formData.append("carId", carId);
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(`${baseurl}/api/v1/car/upload-images`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setMyCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId ? { ...car, images: res.data.images } : car
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload images");
    }
  };

  const handleInputChange = (carId, field, value, isInsideTag) => {
    setMyCars((prevCars) =>
      prevCars.map((car) =>
        car._id === carId
          ? isInsideTag
            ? {
                ...car,
                tags: {
                  ...car.tags,
                  [field]: value,
                },
              }
            : { ...car, [field]: value }
          : car
      )
    );
  };

  return (
    <div className="myCars page py-5">
      <div className="container">
        <h1 className="text-center mb-4">Your Posted Cars</h1>
        {myCars.length > 0 ? (
          <div className="row">
            {myCars.map((element) => (
              <div className="col-12 mb-4" key={element._id}>
                <div className="car-card">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) =>
                            handleInputChange(element._id, "title", e.target.value)
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Dealer</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.tags.dealer}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "dealer",
                              e.target.value,
                              true
                            )
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Car Type</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.tags.carType}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "carType",
                              e.target.value,
                              true
                            )
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Company</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.tags.company}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "company",
                              e.target.value,
                              true
                            )
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "description",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Images</label>
                        <div className="d-flex flex-wrap">
                          {element.images.map((imgUrl) => (
                            <div key={imgUrl} className="position-relative me-2 mb-2">
                              <img
                                src={imgUrl}
                                alt="Car"
                                className="img-thumbnail"
                                style={{ width: "100px", height: "100px" }}
                              />
                              {editingMode === element._id && (
                                <button
                                  onClick={() =>
                                    handleDeleteImage(element._id, imgUrl)
                                  }
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                  style={{ zIndex: 1 }}
                                >
                                  <RxCross2 />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        {editingMode === element._id && (
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleUploadImages(element._id, e.target.files)
                            }
                            className="form-control mt-2"
                          />
                        )}
                      </div>
                    </div>

                    <div className="card-footer d-flex justify-content-between">
                      <div>
                        {editingMode === element._id ? (
                          <>
                            <button
                              onClick={() => handleUpdateCar(element._id)}
                              className="btn btn-success btn-sm me-2"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={handleDisableEdit}
                              className="btn btn-secondary btn-sm"
                            >
                              <RxCross2 />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEnableEdit(element._id)}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCar(element._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">You haven't added any cars yet or all have been deleted.</p>
        )}
      </div>
    </div>
  );
};

export default MyCars;
