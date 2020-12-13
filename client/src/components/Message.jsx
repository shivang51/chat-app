import React from "react";

function Message(props) {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    document.querySelector(
      ".message-container"
    ).scrollTop = document.querySelector(".message-container").scrollHeight;

    const date = new Date(props.time);

    let time =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    setTime(time);
  }, [props.time]);

  return (
    <div className={`message ${props.type}`}>
      <h4>{props.message}</h4>
      <h6 id="time">{time}</h6>
    </div>
  );
}

export default Message;
