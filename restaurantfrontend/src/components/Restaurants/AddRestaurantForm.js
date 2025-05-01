import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import '../../styles/g_AddRestaurantForm.css';
import { useNavigate } from "react-router-dom";

const AddRestaurantForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      openingTime: "",
      closingTime: "",
      ownerName: "",
      image: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      password: Yup.string().required("Password is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
      openingTime: Yup.string()
        .required("Opening time is required")
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be valid time (HH:MM)"),
      closingTime: Yup.string()
        .required("Closing time is required")
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be valid time (HH:MM)"),
      ownerName: Yup.string().required("Owner name is required")

    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formattedValues = {
          ...values,
          openingTime: formatTime(values.openingTime),
          closingTime: formatTime(values.closingTime)
        };

        const response = await axios.post(
          "http://localhost:8081/api/restaurants/register",
          formattedValues
        );

        const restaurantId = response.data.id;
        localStorage.setItem("restaurantId", restaurantId);

        alert("Restaurant registered successfully!");
        resetForm();
        navigate("/");
      } catch (error) {
        alert(`Failed to register restaurant: ${error.response?.data?.message || error.message}`);
        console.error("Registration error:", error);
      }
    }
  });

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="form-container">
      <h2>Add New Restaurant</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="error">{formik.errors.phone}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.touched.address && formik.errors.address && (
            <div className="error">{formik.errors.address}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="openingTime">Opening Time</label>
          <input
            type="time"
            id="openingTime"
            name="openingTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.openingTime}
            step="300"
          />
          {formik.touched.openingTime && formik.errors.openingTime && (
            <div className="error">{formik.errors.openingTime}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="closingTime">Closing Time</label>
          <input
            type="time"
            id="closingTime"
            name="closingTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.closingTime}
            step="300"
          />
          {formik.touched.closingTime && formik.errors.closingTime && (
            <div className="error">{formik.errors.closingTime}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">Owner Name</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.ownerName}
          />
          {formik.touched.ownerName && formik.errors.ownerName && (
            <div className="error">{formik.errors.ownerName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Restaurant Image</label>
          <input
            type="text"
            id="image"
            name="image"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.image}
          />
          {formik.touched.image && formik.errors.image && (
            <div className="error">{formik.errors.image}</div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Register Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;