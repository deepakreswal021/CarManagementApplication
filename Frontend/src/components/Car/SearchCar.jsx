import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const SearchCars = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const { isAuthorized, baseurl } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetch cars based on search query
  const fetchCars = (query = "") => {
    if (!query) {
      try {
        axios
          .get(`${baseurl}/api/v1/car/getall`, {
            withCredentials: true,
          })
          .then((res) => {
            const data = res.data?.myCars;
            console.log(data);
            setCars(data);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(query);
      axios
        .get(`${baseurl}/api/v1/car/search/${query}`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data?.cars; // Ensure you're accessing `cars` from response
          console.log(data);
          setCars(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // Fetch cars on component mount or when search query changes
  useEffect(() => {
    if (isAuthorized) {
      fetchCars(searchQuery); // Call the fetch function with the current search query
    } else {
      navigateTo("/");
    }
  }, [searchQuery, isAuthorized, navigateTo, baseurl]);

  return (
    <section className="cars page py-5">
      <div className="container">
        <h1 className="text-center">All Available Cars</h1>

        {/* Search Bar */}
        <div className="row mb-4">
          <input
            type="text"
            placeholder="Search car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            className="form-control w-100"
          />
        </div>
        
        {/* Car Listing */}
        <div className={`row ${cars.length === 1 ? "justify-content-center" : ""}`}>
          {cars.length > 0 ? (
            cars.map((element) => (
              <div
                className={`${
                  cars.length === 1 ? "col-md-12" : "col-md-6"
                } mb-4`} // Wider card if only one car
                key={element._id}
              >
                <div className="card shadow-sm">
                  {/* Fixed Image Size */}
                  <img
                    src={element.images[0]} // Assuming you want to display the first image
                    alt={element.title}
                    className="card-img-top"
                    style={{
                      objectFit: "cover", // Ensures the image fills the area without distortion
                      width: "100%", // Ensures the image fits the card width
                      height: "250px", // Fixed height for all images
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{element.title}</h5>
                    <p className="card-text">
                      <strong>Type:</strong> {element.tags.carType}
                    </p>
                    <p className="card-text">
                      <strong>Company:</strong> {element.tags.company}
                    </p>
                    <Link
                      to={`/car/${element._id}`}
                      className="btn btn-primary w-100 mt-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No cars found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchCars;
