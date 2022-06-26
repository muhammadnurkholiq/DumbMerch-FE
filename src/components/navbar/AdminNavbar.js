// react
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav, Modal, Button } from "react-bootstrap";

// userContext
import { AuthContext } from "../../context/AuthContext";

// css
import "../../assets/css/Navbar.css";

// images
import ImgnavDumbMerch from "../../assets/images/ic_nav_DumbMerch.png";

export default function GuestNavbar() {
  // context
  const [state, dispatch] = useContext(AuthContext);
  // state modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // handle logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="guestNavbar mt-2">
      <Navbar expand="lg">
        <Container>
          <NavLink to="/adminComplain" className="navbar-brand">
            <img
              src={ImgnavDumbMerch}
              className="d-inline-block align-top"
              alt="DumbMerch"
            />
          </NavLink>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink to="/adminComplain" className="nav-link">
                Complain
              </NavLink>
              <NavLink to="/Product" className="nav-link">
                Product
              </NavLink>
              <Button onClick={handleShow} className="nav-link nav-logout">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>

          {/* modal logout  */}
          <Modal show={show} onHide={handleClose}>
            <h1 className="modal-title">Confirmation</h1>
            <h1 className="modal-info">Are you sure you want to logout?</h1>
            <div className="modal-btns">
              <Button onClick={handleLogout} className="btn-yes">
                Yes
              </Button>
              <Button onClick={handleClose} className="btn-no">
                No
              </Button>
            </div>
          </Modal>
        </Container>
      </Navbar>
    </div>
  );
}
