// react
import React from "react";
import { Card } from "react-bootstrap";
import ScrollableFeed from "react-scrollable-feed";

import avatar from "../../assets/images/avatar.png";

export default function Chat({ contact, user, messages, sendMessage }) {
  return (
    <>
      <form>
        <input
          onKeyPress={sendMessage}
          type="text"
          placeholder="Send Message"
          className="sendMessage"
        />
      </form>
      {contact ? (
        <>
          <ScrollableFeed>
            <div className="chat">
              {messages.map((item, index) => (
                <>
                  {item.idSender === user.id ? (
                    <>
                      {/* send chat  */}
                      <Card className="send-chat" key={index}>
                        <div className="chat-text">
                          <i class="bi bi-triangle-fill triangle"></i>
                          <div className="text">
                            <h1>{item.message}</h1>
                          </div>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <>
                      {/* receive chat */}
                      <Card className="receive-chat" key={index}>
                        <div className="user-image">
                          <div className="img-side">
                            <img
                              src={contact.image || avatar}
                              alt={item.name}
                            />
                          </div>
                        </div>
                        <div className="chat-text">
                          <i class="bi bi-triangle-fill triangle"></i>
                          <div className="text">
                            <h1>{item.message}</h1>
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </>
              ))}
            </div>
          </ScrollableFeed>
        </>
      ) : (
        <div
          style={{ height: "89.5vh" }}
          className="h4 d-flex justify-content-center align-items-center"
        >
          No Message
        </div>
      )}
    </>
  );
}
