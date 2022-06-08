// react
import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// pages
import Auth from "./pages/Auth";

// user route
import HomePage from "./pages/Customer_HomePage";
import CustomerComplain from "./pages/Customer_Complain";
import DetailProduct from "./pages/Customer_DetailProduct";
import Profile from "./pages/Customer_Profile";
// admin route
import AdminComplain from "./pages/Admin_Complain";
import Category from "./pages/Admin_Category";
import AddCategory from "./pages/Admin_AddCategory";
import EditCategory from "./pages/Admin_EditCategory";
import Product from "./pages/Admin_Product";
import AddProduct from "./pages/Admin_AddProduct";
import EditProduct from "./pages/Admin_EditProduct";

// Context
import { AuthContext } from "./context/AuthContext";

// API
import { API, setAuthToken } from "./config/Api";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(AuthContext);

  // redirect auth
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin === false) {
      navigate("/");
    } else {
      if (state.user.status === "admin") {
        navigate("/adminComplain");
      } else if (state.user.status === "customer") {
        navigate("/homepage");
      }
    }
  }, [state]);

  // Create function for check user token here ...
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data.user;

      console.log("payload " + payload);

      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Call function check user with useEffect didMount here ...
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/detailProduct/:id" element={<DetailProduct />} />
      <Route path="/customerComplain" element={<CustomerComplain />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/adminComplain" element={<AdminComplain />} />
      <Route path="/category" element={<Category />} />
      <Route path="/addCategory" element={<AddCategory />} />
      <Route path="/editCategory/:id" element={<EditCategory />} />
      <Route path="/product" element={<Product />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/editProduct/:id" element={<EditProduct />} />
    </Routes>
  );
}
