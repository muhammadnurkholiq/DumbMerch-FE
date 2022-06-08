import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Container } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// API
import { API } from "../config/Api";

// css
import "../assets/css/EditProduct.css";

// components
import AdminNavbar from "../components/navbar/AdminNavbar";

export default function Admin_AddProduct() {
  // usaNavigate
  let navigate = useNavigate();
  // useState
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    image: "",
    name: "",
    desc: "",
    price: "",
    qty: "",
    category: "",
  });

  // handle change value
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  // handle submit
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // config
      // Configuration
      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      // data
      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("name", form.name);
      formData.set("desc", form.desc);
      formData.set("price", form.price);
      formData.set("qty", form.qty);
      formData.set("category", form.category);

      // API add product
      const response = await API.post("/products", formData, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        navigate("/product");
      } else {
        NotificationManager.error(
          response.data.message,
          response.data.status,
          3000
        );
      }
    } catch (error) {
      NotificationManager.success(
        "Product add successfully",
        "Add Product",
        3000
      );
    }
  });

  // get category
  // Fetching category data
  const getCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="editProduct">
        <Container>
          <h1>Add Product</h1>

          <form autocomplete="off" onSubmit={(e) => handleSubmit.mutate(e)}>
            {preview && (
              <div>
                <img
                  src={preview}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                  alt="preview"
                />
              </div>
            )}
            <input
              type="file"
              id="upload"
              name="image"
              hidden
              onChange={handleChange}
            />
            <div className="productImage">
              <label htmlFor="upload" className="btn btn-productImage">
                Upload Image
              </label>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
            />
            <textarea
              name="desc"
              placeholder="Product Desc"
              value={form.desc}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Product Price"
              value={form.price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="qty"
              placeholder="Product Stock"
              value={form.qty}
              onChange={handleChange}
            />

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected hidden>
                Select Category
              </option>
              {categories?.map((item) => (
                <>
                  <option className="options" value={item.name}>
                    {item.name}
                  </option>
                </>
              ))}
            </select>

            <button className="btn-save">Add</button>
          </form>
        </Container>
      </div>
    </>
  );
}
