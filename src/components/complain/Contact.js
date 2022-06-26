import React, { useState } from "react";
import { Card } from "react-bootstrap";

import avatar from "../../assets/images/avatar.png";

export default function Contact({ dataContact, clickContact, contact }) {
  return (
    <>
      {dataContact?.length > 0 ? (
        <>
          {dataContact.map((item) => (
            <>
              {/* user  */}
              <Card
                key={item.id}
                className={`${contact?.id === item?.id && "contact-active"}`}
                onClick={() => {
                  clickContact(item);
                }}
              >
                <div className="user-image">
                  <div className="img-side">
                    <img src={item.image || avatar} alt={item.name} />
                  </div>
                </div>
                <div className="user-datas">
                  <h1 className="user-name">{item.name}</h1>
                  <h1 className="user-notif">{item.message}</h1>
                </div>
              </Card>
            </>
          ))}
        </>
      ) : (
        <>
          <div className="noContact">
            <h1>No contact</h1>
          </div>
        </>
      )}
    </>
  );
}
