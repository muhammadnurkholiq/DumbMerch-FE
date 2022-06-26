// react
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useMutation } from "react-query";
import { Container, Card } from "react-bootstrap";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/Api";

// css
import "../../assets/css/customer/DetailProduct.css";

// components
import GuestNavbar from "../../components/navbar/GuestNavbar";

export default function DetailProduct() {
  // params
  const { id } = useParams();
  // navigate
  let navigate = useNavigate();
  // state
  let [loading, setLoading] = useState(true);
  let [products, setProducts] = useState([]);

  // get product
  const getProducts = async () => {
    try {
      const response = await API.get(`/products/${id}`);

      if (response.data.status === "Success") {
        setProducts(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();

    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "Client key here ...";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleBuy = useMutation(async () => {
    try {
      // Get data from product
      const data = {
        idProduct: products.id,
        idSeller: products.user.id,
        price: products.price,
      };

      // Data body
      const body = JSON.stringify(data);

      // Configuration
      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-type": "application/json",
        },
      };

      // Insert transaction data
      const response = await API.post("/transaction", body, config);

      // Create variabel for store token payment from response here ...
      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

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
      <GuestNavbar />
      {/* content */}
      <div className="detailProduct">
        {" "}
        <Container key={products.id}>
          {/* product image  */}
          <div className="product-image">
            <Card className="card-img-product">
              <Card.Img
                variant="top"
                src={products.image}
                className="img-product"
                loading="lazy"
              />
            </Card>
          </div>
          {/* product details  */}
          <div className="product-details">
            <h1 className="product-title">{products.name}</h1>
            <h2 className="product-stock">Stock : {products.qty}</h2>
            <textarea
              className="product-info"
              value={products.desc}
              disabled
            ></textarea>
            <h2 className="product-price">
              {convertRupiah.convert(products.price)}
            </h2>
            <button
              onClick={() => handleBuy.mutate()}
              className="btn btn-product-buy"
            >
              Buy
            </button>
          </div>
        </Container>
      </div>
    </>
  );
}
