import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const { isAuthorized, baseurl } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get(`${baseurl}/api/v1/car/getall`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data?.myCars;
          setCars(data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="cars page bg-light py-5">
      <div className="container">
        <h1 className="text-center mb-4 text-dark">All Available Cars</h1>
        <div className="row g-4">
          {cars && cars.length > 0 ? (
            cars.map((element) => (
              <div key={element._id} className="col-lg-4 col-md-6 col-sm-12">
                <div className="card shadow-sm border-0 rounded-lg h-100">
                  <img
                    src={element.images[0] || "https://via.placeholder.com/300"}
                    className="card-img-top rounded-top"
                    alt={element.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary">{element.title}</h5>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        to={`/car/${element._id}`}
                        className="btn btn-primary btn-sm w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-secondary">
              No cars available at the moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cars;
