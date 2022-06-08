import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useQuery, useMutation } from "react-query";
import { Table, Button, Modal, Container, Row, Col } from "react-bootstrap";

// API
import { API } from "../config/Api";

// css
import "../assets/css/Category.css";

// image
import imgEmpty from "../assets/images/empty.png";

// components
import AdminNavbar from "../components/navbar/AdminNavbar";
import ModalDelete from "../components/modal/DeleteData";

export default function Admin_Category() {
  // navigate
  let navigate = useNavigate();
  // Fetching category
  // Fetching data from database
  let { data: categories, refetch } = useQuery("categoriesCache", async () => {
    const response = await API.get("/categories");
    return response.data.data.category;
  });

  // pagination
  const [pageNumber, setPageNumber] = useState(0);
  const categoryPerPage = 5;
  const pagesVisited = pageNumber * categoryPerPage;
  const pageCount = Math.ceil(categories?.length / categoryPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // category
  const displayCategories = categories
    ?.slice(pagesVisited, categoryPerPage + pagesVisited)
    .map((item, index) => {
      return (
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
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

  // handle add category
  const handleAdd = () => {
    navigate("../addCategory");
  };

  // handle edit
  const handleEdit = (id) => {
    navigate(`/editCategory/${id}`);
  };

  // useState
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

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
      <AdminNavbar />
      <div className="category">
        <Container>
          <Row>
            <Col>
              <div className="category-header">
                <h1>List Category</h1>
                <Button onClick={handleAdd}>Add Category</Button>
              </div>
            </Col>
          </Row>
          <Row>
            {categories?.length > 0 ? (
              <>
                {categories?.length > 5 && (
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
                      <th className="table-name">Category Name</th>
                      <th className="table-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>{displayCategories}</tbody>
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
                  <div className="mt-3">No data category</div>
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
