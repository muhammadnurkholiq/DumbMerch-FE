import { Modal, Button } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

export default function DeleteData({ show, handleClose, setConfirmDelete }) {
  const handleDelete = () => {
    setConfirmDelete(true);
    NotificationManager.success(
      "Category deleted successfully",
      "Success",
      3000
    );
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <h1 className="modal-title">Delete Data</h1>
      <h1 className="modal-info">Are you sure you want to delete this data?</h1>
      <div className="modal-btns">
        <Button onClick={handleDelete} className="btn-yes">
          Yes
        </Button>
        <Button onClick={handleClose} className="btn-no">
          No
        </Button>
      </div>
    </Modal>
  );
}
