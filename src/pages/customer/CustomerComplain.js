import React, { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

// css
import "../../assets/css/Complain.css";

// components
import GuestNavbar from "../../components/navbar/GuestNavbar";
import Chat from "../../components/complain/Chat";
import Contact from "../../components/complain/Contact";

// socket io
import { io } from "socket.io-client";
let socket;

export default function CustomerComplain() {
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
      socket.emit("load messages", contact?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });
    loadContact();

    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const loadContact = () => {
    // emit event load admin contact
    socket.emit("load admin contact");
    // listen event to get admin contact
    socket.on("admin contact", (data) => {
      // manipulate data to add message property with the newest message

      const dataContact = {
        ...data,
        message:
          messages.length > 0
            ? messages[messages.length - 1].message
            : "Click here to start message",
      };
      setContacts([dataContact]);
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
      <GuestNavbar />
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
