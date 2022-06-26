import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";

// css
import "../../assets/css/Complain.css";

// components
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Chat from "../../components/complain/Chat";
import Contact from "../../components/complain/Contact";

// socket io
import { io } from "socket.io-client";
let socket;

export default function AdminComplain() {
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);

  const [messages, setMessages] = useState([]);

  const [state] = useContext(AuthContext);

  useEffect(() => {
    socket = io(
      process.env.REACT_APP_SERVER_URL ||
        "https://dumbmerch-app-backend.herokuapp.com/" ||
        "http://localhost:5000",
      {
        auth: {
          token: localStorage.getItem("token"),
        },

        query: {
          id: state.user.id,
        },
      }
    );

    socket.on("new message", () => {
      console.log("contact : ", contact);
      socket.emit("load messages", contact?.id);
    });

    loadContacts();

    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const loadContacts = () => {
    socket.emit("load customer contacts");
    socket.on("customer contacts", (data) => {
      // filter just customers which have sent a message
      let dataContacts = data.filter(
        (item) =>
          item.status !== "admin" &&
          (item.recipientMessage.length > 0 || item.senderMessage.length > 0)
      );

      // manipulate customers to add message property with the newest message

      dataContacts = dataContacts.map((item) => ({
        ...item,
        message:
          item.senderMessage.length > 0
            ? item.senderMessage[item.senderMessage.length - 1].message
            : "Click here to start message",
      }));
      console.log(dataContacts);
      setContacts(dataContacts);
    });
  };

  // used for active style when click contact
  const onClickContact = (data) => {
    setContact(data);

    socket.emit("load messages", data.id);
  };

  const loadMessages = () => {
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      }
      loadContacts();
    });
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      socket.emit("send message", data);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* navbar */}
      <AdminNavbar />
      {/* content  */}
      <div className="complain">
        <Container>
          {/* list users  */}
          <div className="listUsers">
            <Contact
              dataContact={contacts}
              clickContact={onClickContact}
              contact={contact}
            />
          </div>
          {/* chat */}
          <div className="chatSide">
            <Chat
              contact={contact}
              messages={messages}
              user={state.user}
              sendMessage={onSendMessage}
            />
          </div>
        </Container>
      </div>
    </>
  );
}
