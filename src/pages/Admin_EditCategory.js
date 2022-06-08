import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { Container } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// API
import { API } from "../config/Api";

// css
import "../assets/css/EditCategory.css";

// components
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function Admin_EditCategory() {
  const { id } = useParams();
  let navigate = useNavigate();

  // get category
  const [form, setForm] = useState({
    name: "",
  });

  useQuery("categoryCache", async () => {
    const response = await API.get("/categories/" + id);
    setForm({ name: response.data.data.category.name });
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

      // API update category
      const response = await API.put(`/categories/${id}`, body, config);

      if (response.data.status == "Success") {
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
              value={form.name}
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
