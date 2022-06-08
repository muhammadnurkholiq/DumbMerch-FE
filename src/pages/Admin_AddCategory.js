import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Container } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// API
import { API } from "../config/Api";

// css
import "../assets/css/EditCategory.css";

// components
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function Admin_AddCategory() {
  // usaNavigate
  let navigate = useNavigate();

  // form category
  const [form, setForm] = useState({
    name: "",
  });

  // handle change form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // config
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // data
      const body = JSON.stringify(form);

      // API add category
      const response = await API.post("/categories", body, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        navigate("/category");
      } else {
        NotificationManager.error(
          response.data.message,
          response.data.status,
          3000
        );
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  return (
    <>
      <AdminNavbar />
      <div className="editCategory">
        <Container>
          <h1>Add Category</h1>
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <input
              id="name"
              name="name"
              onChange={handleChange}
              placeholder="Category Name"
              required
            />
            <button className="btn-save">Add</button>
          </form>
        </Container>
      </div>
    </>
  );
}
