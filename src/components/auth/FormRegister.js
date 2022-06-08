// react
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { useMutation } from "react-query";

// API
import { API } from "../../config/Api";

export default function FormRegister() {
  // usestate
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    name: "",
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

      // API register
      const response = await API.post("/register", body, config);

      // response
      if (response.data.status === "Success") {
        const alert = <Alert variant="success">{response.data.message}</Alert>;
        setMessage(alert);
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
        <h1 className="mb-3 formTitle">Register</h1>
        {/* set message alert  */}
        {message}
        {/* form register */}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="form">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-3 py-2 mt-3"
              minLength={3}
              autoComplete="off"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-3 py-2 mt-3"
              autoComplete="off"
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
              autoComplete="off"
              required
            />
          </div>
          <button className="btn btn-FormAuth mt-5">Register</button>
        </form>
      </div>
    </div>
  );
}
