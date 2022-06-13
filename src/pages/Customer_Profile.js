// react
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { NotificationManager } from "react-notifications";
import { Card, Container, Button } from "react-bootstrap";
import dateFormat from "dateformat";
import convertRupiah from "rupiah-format";

// API
import { API } from "../config/Api";

// css
import "../assets/css/Profile.css";

// images
import Avatar from "../assets/images/avatar.png";

// components
import GuestNavbar from "../components/navbar/GuestNavbar";

export default function Customer_Profile() {
  // profile
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState();
  const [image, setImage] = useState();
  const [form, setForm] = useState({
    image: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  // change value state form
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

  let { data: users, refetch } = useQuery("usersCache", async (e) => {
    const response = await API.get(`/user`);
    setForm({
      image: response.data.data.user.image,
      name: response.data.data.user.name,
      email: response.data.data.user.email,
      phone: response.data.data.user.phone,
      gender: response.data.data.user.gender,
      address: response.data.data.user.address,
    });
    setImage({
      image: response.data.data.user.image,
    });
    setPreview(response.data.data.user.image);
  });

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // config
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // data
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("name", form.name);
      formData.set("phone", form.phone);
      formData.set("gender", form.gender);
      formData.set("address", form.address);

      // API add profile
      const response = await API.patch("/user", formData, config);

      if (response.data.status === "Success") {
        NotificationManager.success(
          response.data.message,
          response.data.status,
          3000
        );
        setIsEdit(false);
        refetch();
      }
    } catch (error) {
      NotificationManager.error("Server error", "Error", 3000);
      console.log(error);
    }
  });

  const editProfile = () => {
    setIsEdit(true);
  };

  // transaction
  let { data: transactions } = useQuery("transactionsCache", async (e) => {
    const response = await API.get("/transactions");
    return response.data.data;
  });

  return (
    <>
      <GuestNavbar />
      <div className="profile">
        <Container>
          {/* myProfile */}
          {isEdit ? (
            <form
              className="myProfile"
              onSubmit={(e) => handleSubmit.mutate(e)}
            >
              <div className="MyProfile-header">
                <h1 className="profile-title">My Profile</h1>
                <div className="profile-action">
                  <Button type="submit" className="btn-profile btn-submit">
                    Save Profile
                  </Button>
                </div>
              </div>
              <div className="myProfile-details">
                {/* profile image  */}
                {form.image === null ||
                form.image ===
                  "https://res.cloudinary.com/muhammad-nurkholiq/image/upload/v1654678474/null" ? (
                  <>
                    {preview && (
                      <div className="profile-image">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={handleChange}
                          hidden
                        ></input>
                        <label for="image">
                          <h1>Upload Image</h1>
                        </label>
                        <img src={Avatar} alt={form.name} loading="lazy" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {preview && (
                      <div className="profile-image">
                        <input
                          type="file"
                          id="image"
                          name="image"
                          onChange={handleChange}
                          hidden
                        ></input>
                        <label for="image">
                          <h1>Upload Image</h1>
                        </label>
                        <img src={preview} alt={form.name} loading="lazy" />
                      </div>
                    )}
                  </>
                )}
                {/* profile name */}
                <div className="profile-datas">
                  <div className="profile-data">
                    <h1 className="data-title">Name</h1>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  {/* profile email */}
                  <div className="profile-data">
                    <h1 className="data-title">Email</h1>
                    <input
                      name="rmail"
                      type="text"
                      value={form.email}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  {/* profile phone */}
                  <div className="profile-data">
                    <h1 className="data-title">Phone</h1>
                    <input
                      name="phone"
                      type="text"
                      value={form.phone}
                      onChange={handleChange}
                      minLength={8}
                    />
                  </div>
                  {/* profile gender */}
                  <div className="profile-data">
                    <h1 className="data-title">Gender</h1>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="" selected hidden>
                        Select Category
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  {/* profile address */}
                  <div className="profile-data">
                    <h1 className="data-title">Address</h1>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="myProfile">
              <div className="MyProfile-header">
                <h1 className="profile-title">My Profile</h1>
                <Button onClick={editProfile} className="btn-profile btn-edit">
                  Edit Profile
                </Button>
              </div>
              <div className="myProfile-details">
                {/* profile image  */}
                {form.image === null ||
                form.image ===
                  "https://res.cloudinary.com/muhammad-nurkholiq/image/upload/v1654678474/null" ? (
                  <div className="profile-image">
                    <img src={Avatar} alt={form.name} loading="lazy" />
                  </div>
                ) : (
                  <div className="profile-image">
                    <img src={form.image} alt={form.name} loading="lazy" />
                  </div>
                )}

                {/* profile name */}
                <div className="profile-datas">
                  <div className="profile-data">
                    <h1 className="data-title">Name</h1>
                    <h1 className="data-value">{form.name}</h1>
                  </div>
                  {/* profile email */}
                  <div className="profile-data">
                    <h1 className="data-title">Email</h1>
                    <h1 className="data-value">{form.email}</h1>
                  </div>
                  {/* profile phone */}
                  <div className="profile-data">
                    <h1 className="data-title">Phone</h1>
                    <h1 className="data-value">{form.phone}</h1>
                  </div>
                  {/* profile gender */}
                  <div className="profile-data">
                    <h1 className="data-title">Gender</h1>
                    <h1 className="data-value">{form.gender}</h1>
                  </div>
                  {/* profile address */}
                  <div className="profile-data">
                    <h1 className="data-title">Address</h1>
                    <h1 className="data-value">{form.address}</h1>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* myTransaction */}
          <div className="myTransaction">
            <h1 className="transaction-title">My Transaction</h1>
            {/* transaction list  */}
            <div className="transaction-list">
              {transactions?.length > 0 ? (
                <>
                  {transactions?.map((item) => (
                    <>
                      {/* transaction card  */}
                      <Card>
                        {/* transaction data  */}
                        <div className="transaction-data">
                          <div className="transaction-img">
                            <div className="transaction-product-img">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                loading="lazy"
                              />
                            </div>
                          </div>
                          {/* transaction details  */}
                          <div className="transaction-details">
                            {/* data 1 */}
                            <div className="data-1">
                              <h1 className="data-name">{item.product.name}</h1>
                              <h1 className="data-date">
                                {dateFormat(
                                  item.createdAt,
                                  "dddd, d mmmm yyyy, HH:MM "
                                )}
                                WIB
                              </h1>
                              <h1 className="data-price">
                                Price : {convertRupiah.convert(item.price)}
                              </h1>
                            </div>
                            {/* data 2 */}
                            <div className="data-2">
                              <h1 className="data-subTotal">
                                Sub Total : {convertRupiah.convert(item.price)}
                              </h1>
                            </div>
                          </div>
                        </div>
                        {/* transaction app  */}
                        <div className={`status-transaction-${item.status}`}>
                          {item.status}
                        </div>
                      </Card>
                    </>
                  ))}
                </>
              ) : (
                <div className="noTransaction">
                  <h1>No data transaction</h1>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
