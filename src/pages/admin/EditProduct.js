import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { Container } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/Api";

// css
import "../../assets/css/admin/EditProduct.css";

// components
import AdminNavbar from "../../components/navbar/AdminNavbar";

export default function EditProduct() {
  const { id } = useParams();
  // usaNavigate
  let navigate = useNavigate();
  // useState
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    image: "",
    name: "",
    desc: "",
    price: "",
    qty: "",
  });

  // get product
  const getProducts = async () => {
    try {
      const response = await API.get(`/products/${id}`);

      if (response.data.status === "Success") {
        setForm({
          name: response.data.data.name,
          desc: response.data.data.desc,
          price: response.data.data.price,
          qty: response.data.data.qty,
        });
        setPreview(response.data.data.image);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Handle change data on form
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
      setLoading(true);

      // config
      const config = {
        method: "PATCH",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      // data
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("name", form.name);
      formData.set("desc", form.desc);
      formData.set("price", form.price);
      formData.set("qty", form.qty);

      // API add product
      const response = await API.patch(`/products/${id}`, formData, config);

      // response
      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        navigate("/product");
        setLoading(false);
      } else {
        NotificationManager.error(
          response.data.message,
          response.data.status,
          3000
        );
        setLoading(false);
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {/* loading  */}
      {loading && (
        <div className="loadingContainer">
          <ReactLoading
            type="spinningBubbles"
            color="#fff"
            height={"20%"}
            width={"20%"}
            className="loading"
          />
        </div>
      )}
      {/* navbar */}
      <AdminNavbar />
      {/* content */}
      <div className="editProduct">
        <Container>
          <h1>Add Product</h1>

          <form onSubmit={(e) => handleSubmit.mutate(e)}>
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

            <button className="btn-save">Add</button>
          </form>
        </Container>
      </div>
    </>
  );
}
