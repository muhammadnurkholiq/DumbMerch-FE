import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import convertRupiah from "rupiah-format";
import ReactLoading from "react-loading";

// API
import { API } from "../../config/Api";

// css
import "../../assets/css/admin/Product.css";

// image
import imgEmpty from "../../assets/images/empty.png";

// components
import AdminNavbar from "../../components/navbar/AdminNavbar";
import ModalDelete from "../../components/modal/DeleteData";

export default function Product() {
  // useState
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get product
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

  // category
  const displayProducts = products
    ?.slice(pagesVisited, productPerPage + pagesVisited)
    .map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td>
            <img src={item.image} />
          </td>
          <td>{item.name}</td>
          <td>{item.desc}</td>
          <td>{convertRupiah.convert(item.price)}</td>
          <td>{item.qty}</td>
          <td>
            <Button
              onClick={() => {
                handleEdit(item.id);
              }}
              className="btn-edit"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                handleDelete(item.id);
              }}
              className="btn-delete"
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });

  let navigate = useNavigate();

  // handle edit
  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`);
  };

  // handle add product
  const handleAdd = () => {
    navigate("/addProduct");
  };

  // modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      setLoading(true);

      const response = await API.delete(`/products/${id}`);

      if (response.data.status === "Success") {
        getProducts();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

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
      {/* content  */}
      <div className="product">
        <Container>
          <Row>
            <Col>
              <div className="product-header">
                <h1>List Product</h1>
                <Button onClick={handleAdd}>Add Product</Button>
              </div>
            </Col>
          </Row>

          <Row>
            {products?.length > 0 ? (
              <>
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
                <Table>
                  <thead>
                    <tr>
                      <th className="table-no">No</th>
                      <th className="table-photo">Photo</th>
                      <th className="table-name">Product Name</th>
                      <th className="table-desc">Product Desc</th>
                      <th className="table-price">Price</th>
                      <th className="table-qty">Qty</th>
                      <th className="table-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>{displayProducts}</tbody>
                </Table>
              </>
            ) : (
              <Col>
                <div className="text-center pt-5">
                  <img
                    src={imgEmpty}
                    className="img-fluid"
                    style={{ width: "40%" }}
                    alt="empty"
                  />
                  <div className="mt-3">No data product</div>
                </div>
              </Col>
            )}

            {/* modal delete  */}
            <ModalDelete
              setConfirmDelete={setConfirmDelete}
              show={show}
              handleClose={handleClose}
            />
          </Row>
        </Container>
      </div>
    </>
  );
}
