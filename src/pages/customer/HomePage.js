import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/Api";

// css
import "../../assets/css/customer/HomePage.css";

// image
import imgEmpty from "../../assets/images/empty.png";

// components
import GuestNavbar from "../../components/navbar/GuestNavbar";

export default function HomePage() {
  // usaNavigate
  let navigate = useNavigate();
  // state
  let [loading, setLoading] = useState(true);
  let [products, setProducts] = useState([]);

  // get products
  const getProducts = async () => {
    try {
      const response = await API.get("/products");

      if (response.data.status === "Success") {
        setProducts(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // pagination
  const [pageNumber, setPageNumber] = useState(0);
  const productPerPage = 5;
  const pagesVisited = pageNumber * productPerPage;
  const pageCount = Math.ceil(products?.length / productPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // go to details product
  const handleDetails = (id) => {
    navigate(`/detailProduct/${id}`);
  };

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
      <GuestNavbar />
      {/* content */}
      <div className="homePage">
        <Container>
          <h1 className="homePageTitle">Product</h1>

          <div className="content">
            {products?.length > 0 ? (
              <>
                <div className="product">
                  {products
                    ?.slice(pagesVisited, productPerPage + pagesVisited)
                    ?.map((item) => (
                      <Card
                        className="cardProduct"
                        key={item.id}
                        onClick={() => {
                          handleDetails(item.id);
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={item.image}
                          loading="lazy"
                        />
                        <Card.Body>
                          <h1 className="cardTitle">{item.name}</h1>
                          <h2 className="cardPrice">
                            {convertRupiah.convert(item.price)}
                          </h2>
                          <h2 className="cardStock">Stock : {item.qty}</h2>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
                {products?.length > 5 && (
                  <>
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel="..."
                      pageCount={pageCount}
                      onPageChange={changePage}
                      containerClassName={"paginationBttns"}
                      previousLinkClassName={"previousBttn"}
                      nextLinkClassName={"nextBttn"}
                      disabledClassName={"paginationDisabled"}
                      activeClassName={"paginationActive"}
                    />
                  </>
                )}
              </>
            ) : (
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
