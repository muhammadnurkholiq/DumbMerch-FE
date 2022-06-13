import { useState } from "react";
import { Container, Card, Col } from "react-bootstrap";
import { useQuery } from "react-query";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import convertRupiah from "rupiah-format";

// API
import { API } from "../config/Api";

// css
import "../assets/css/HomePage.css";

// image
import imgEmpty from "../assets/images/empty.png";

// components
import GuestNavbar from "../components/navbar/GuestNavbar";

export default function Customer_HomePage() {
  // usaNavigate
  let navigate = useNavigate();
  // get product
  let { data: products } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data.product;
  });

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

  return (
    <>
      <GuestNavbar />
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
