import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigateTo = useNavigate();
  const { isAuthorized, baseurl } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }

    axios
      .get(`${baseurl}/api/v1/car/${id}`, { withCredentials: true })
      .then((res) => {
        setCar(res.data.car);
      })
      .catch(() => {
        navigateTo("/notfound");
      });
  }, [id, isAuthorized, baseurl, navigateTo]);

  if (!car) {
    return <p className="text-center">Loading car details...</p>;
  }

  // Slick Carousel Settings
  const settings = {
    dots: true, // Show navigation dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set autoplay speed
    fade: true, // Smooth fade animation
    arrows: true, // Show next/previous arrows
  };

  return (
    <section className="carDetail page py-5">
      <div className="container">
        <h3 className="text-center mb-5 text-uppercase font-weight-bold">Car Details</h3>

        <div className="banner mb-4">
          {/* Slick Carousel */}
          <Slider {...settings}>
            {car.images && car.images.length > 0 ? (
              car.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    className="d-block w-100"
                    alt={`Car image ${index + 1}`}
                    style={{
                      height: "400px", // Fixed height for images
                      objectFit: "cover",
                      // width: "600px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              ))
            ) : (
              <p>No images available for this car.</p>
            )}
          </Slider>
        </div>

        {/* Car Details */}
        <div className="car-info mt-4">
          <div className="row mb-4">
            {/* Title Section */}
            <div className="col-12">
              <h4 className="font-weight-bold text-primary mb-2">{car.title}</h4>
              {/* <p className="lead">{car.title}</p> */}
            </div>
          </div>

          <div className="row mb-4">
            

            {/* Company Section */}
            <div className="col-md-12">
              <h5 className="text-warn font-weight-bold mb-2">{car?.tags?.company}</h5>
            </div>
            
          </div>

          <div className="row mb-4">
            {/* Dealer Section */}
            <div className="col-md-6">
              <h5 className="font-weight-bold text-secondary mb-2">Type</h5>
              <p>{car?.tags?.carType}</p>
            </div>
            <div className="col-md-6">
              <h5 className="font-weight-bold text-secondary mb-2">Dealer</h5>
              <p>{car?.tags?.dealer}</p>
            </div>
            {/* Description Section */}
            <div className="col-md-12">
              <h5 className="font-weight-bold text-secondary mb-2">Description</h5>
              <p>{car.description}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CarDetails;
