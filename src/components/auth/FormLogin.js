// react
import { useState, useContext } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// API
import { API } from "../../config/Api";

// userContext
import { AuthContext } from "../../context/AuthContext";

export default function FormLogin() {
  // usenavigate
  let navigate = useNavigate();
  // useContext
  const [state, dispatch] = useContext(AuthContext);
  // usestate
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // change value state form
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

      // API login
      const response = await API.post("/login", body, config);

      // response
      if (response.data.status === "Success") {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });

        // Status check
        if (response.data.data.status === "admin") {
          navigate("/adminComplain");
        } else {
          navigate("/homepage");
        }

        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
      } else {
        const alert = <Alert variant="danger">{response.data.message}</Alert>;
        setMessage(alert);
      }
    } catch (error) {
      const alert = <Alert variant="danger">Server error</Alert>;
      setMessage(alert);
      console.log(error);
    }
  });

  return (
    <div className="FormAuth d-flex justify-content-center">
      <div className="card-auth p-4">
        <h1 className="mb-3 formTitle">Login</h1>
        {/* alert */}
        {message}
        {/* form login  */}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className=" form">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-3 py-2 mt-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-3 py-2 mt-3"
              minLength={5}
              required
            />
          </div>
          <button className="btn btn-FormAuth mt-5">Login</button>
        </form>
      </div>
    </div>
  );
}
