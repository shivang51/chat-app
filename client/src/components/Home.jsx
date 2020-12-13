import React, { useState } from "react";
import "./styles/css/Home.css";
import ContactsIcon from "@material-ui/icons/Contacts";
import Contact from "./Contact";
import Avatar from "@material-ui/core/Avatar";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";
import Message from "./Message";
import SendIcon from "@material-ui/icons/Send";
import { Redirect } from "react-router-dom";
import axios from "axios";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import RightEmpty from "./RightEmpty";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
}));

function Home(props) {
  const classes = useStyles();
  const [activeInfo, setactiveInfo] = useState({ name: "", id: "" });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newClicked, setnewClicked] = useState(false);
  const [newInfo, setNewInfo] = useState({ cname: "", cid: "" });
  const [newstatus, setnewStatus] = useState(" ");
  const [cid, setCid] = useState([]);
  const [socket, setSocket] = useState(null);
  const [uinfo, setuInfo] = useState({ uid: "", name: "" });
  const [connected, setConnected] = useState(false);

  function contactClick(name, id) {
    setactiveInfo({ name: name, id: id });
  }

  function handleChange(e) {
    const t_message = e.target.value;
    setMessage(t_message);
  }

  function sendClick() {
    const time = new Date();
    socket.emit("new-message", { msg: message, to: activeInfo.id, time: time });
    const to = activeInfo.id;
    setMessages((preMsgs) => {
      if (preMsgs[to])
        return {
          ...preMsgs,
          [to]: [...preMsgs[to], { msg: message, type: "sent", time: time }],
        };
      else
        return {
          ...preMsgs,
          [to]: [{ msg: message, type: "sent", time: time }],
        };
    });
    setMessage("");
    document.querySelector("#message-input").focus();
  }

  function newClick() {
    if (newClicked) {
      setnewClicked(false);
    } else {
      setnewClicked(true);
    }
  }

  function handleNewChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setNewInfo((preInfo) => {
      return { ...preInfo, [name]: value };
    });
  }

  function addClick() {
    if (newInfo.cid && newInfo.cname) {
      if (!cid.includes(newInfo.cid)) {
        axios
          .post("http://localhost:8080/newcontact", {
            ...newInfo,
            uid: uinfo.uid,
          })
          .then((res) => {
            if (res.data === "not-registered") {
              setnewStatus("User not connected with We-Chat");
            } else if (res.data === "added") {
              setContacts((preContacts) => {
                return [
                  ...preContacts,
                  { id: newInfo.cid, savedName: newInfo.cname },
                ];
              });
              setnewStatus("Added to Contacts");
            }
            setTimeout(() => {
              setnewStatus("");
            }, 2000);
            setNewInfo({ cname: "", cid: "" });
          });
      } else {
        setnewStatus("Already in your contacts");
        setTimeout(() => {
          setnewStatus("");
        }, 2000);
      }
    } else {
      setnewStatus("All fields are compulsory");
      setTimeout(() => {
        setnewStatus("");
      }, 2000);
    }
  }

  //uinfo change
  React.useEffect(() => {
    if (uinfo.uid) {
      axios
        .post("http://localhost:8080/contacts", { uid: uinfo.uid })
        .then((res) => {
          const contacts = res.data;
          setContacts(contacts);
        });
    }
  }, [uinfo]);

  //uinfo seting
  React.useEffect(() => {
    if (props.userId !== uinfo.uid) {
      setuInfo({ uid: props.userId, name: uinfo.name });
    }
  }, [props, uinfo]);

  //contacts change
  React.useEffect(() => {
    contacts.forEach((v) => {
      setCid((precid) => {
        return [...precid, v.id];
      });
    });
  }, [contacts]);

  //socket change
  React.useEffect(() => {
    if (socket) {
      console.log("connection made");
      socket.on("r-msg", (data) => {
        const from = data.from;
        console.log(from, data.msg);
        setMessages((preMsgs) => {
          if (preMsgs[from])
            return {
              ...preMsgs,
              [from]: [
                ...preMsgs[from],
                { msg: data.msg, type: "received", time: data.time },
              ],
            };
          else
            return {
              ...preMsgs,
              [from]: [{ msg: data.msg, type: "received", time: data.time }],
            };
        });
      });
    }
  }, [socket]);

  //socket connect
  React.useEffect(() => {
    if (!connected && uinfo.uid) {
      const new_socket = io("http://localhost:8080");

      new_socket.emit("joined", { name: uinfo.uid });

      new_socket.on("joined-confirm", (data) => {
        setConnected(true);
        setSocket(new_socket);
      });
    }
  }, [socket, uinfo, connected]);

  React.useEffect(async () => {
    async function fetchData() {
      for (let contact of contacts) {
        const res = await axios.post("http://localhost:8080/getchat", {
          cid: contact.id,
          uid: uinfo.uid,
          date: "latest",
        });

        res.data.forEach((v) => {
          setMessages((preMsgs) => {
            if (preMsgs[contact.id])
              return {
                ...preMsgs,
                [contact.id]: [...preMsgs[contact.id], v],
              };
            else
              return {
                ...preMsgs,
                [contact.id]: [v],
              };
          });
        });
      }
    }
    if (contacts && messages.length === 0) {
      fetchData();
    }
  }, [contacts, uinfo, messages]);

  return (
    <div className="home">
      {props.isLogedIn ? (
        <div className="container">
          <div className="left-container">
            <div className="top-bar">
              <div className="middle">
                <ContactsIcon />
                {newClicked ? <h4>New</h4> : <h4>Contacts</h4>}
              </div>
              <AddCircleIcon onClick={newClick} className={"new-button"} />
            </div>
            {newClicked ? (
              <div className="new-container">
                <h4>Id should be unique.</h4>
                <h4 id="status">{newstatus}</h4>
                <input
                  type="text"
                  name="cname"
                  placeholder="Name"
                  value={newInfo.cname}
                  onChange={handleNewChange}
                />
                <input
                  type="text"
                  name="cid"
                  placeholder="Id"
                  value={newInfo.cid}
                  onChange={handleNewChange}
                />
                <button onClick={addClick}>Add</button>
              </div>
            ) : (
              <div className="contacts-container">
                {contacts.map((contact, ind) => {
                  return (
                    <Contact
                      classes={classes}
                      key={ind}
                      cid={contact.id}
                      name={contact.savedName}
                      handleClick={contactClick}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="right-container">
            {activeInfo.name ? (
              <>
                <div className="top-bar">
                  <Avatar
                    className={`${classes.orange} ${classes.small} avatar`}
                  >
                    {activeInfo.name[0]}
                  </Avatar>
                  <div className="info">
                    <h4>{activeInfo.name}</h4>
                    <h4>{activeInfo.id}</h4>
                  </div>

                  <div className="other">
                    <h4>typing...</h4>
                  </div>
                </div>

                <div className="message-container">
                  {messages[activeInfo.id]
                    ? messages[activeInfo.id]
                        .sort((a, b) => new Date(a.time) - new Date(b.time))
                        .map((m, i) => {
                          return (
                            <Message
                              key={i}
                              type={m.type}
                              message={m.msg}
                              time={m.time}
                            />
                          );
                        })
                    : null}
                </div>

                <div className="send-container">
                  <AttachFileIcon />
                  <textarea
                    type="text"
                    name="message"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message"
                    multiple
                    rows="1"
                    id="message-input"
                  />
                  <SendIcon onClick={sendClick} id="send-button" />
                </div>
              </>
            ) : (
              <RightEmpty />
            )}
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </div>
  );
}

export default Home;
