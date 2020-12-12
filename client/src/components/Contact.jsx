import React from "react";
import Avatar from "@material-ui/core/Avatar";

function Contact(props) {
  const classes = props.classes;

  function handleClick() {
    props.handleClick(props.name, props.cid);
  }

  return (
    <div className="contact" onClick={handleClick}>
      <Avatar className={`${classes.orange} avatar`}>{props.name[0]}</Avatar>
      <div className="info">
        <h4 id="contactName">{props.name}</h4>
        <h4 id="contactId">{props.cid}</h4>
      </div>
    </div>
  );
}

export default Contact;
