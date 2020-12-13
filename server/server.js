const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  getUserData,
  setNewUser,
  checkUser,
  getContacts,
  setNewContact,
  getChat,
  getLatest,
} = require("./firebase");
const connect = require("./socket");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/userdata", async (req, res) => {
  const uid = req.body.uid;
  if (uid) {
    const data = await getUserData(uid);
    res.send(data);
  }
});

app.post("/newUser", async (req, res) => {
  const info = req.body;
  if (info) {
    const res1 = await checkUser(info.gmail);
    if (res1.exsist) {
      res.send("exsist");
    } else {
      await setNewUser(info.gmail, info);
      res.send("added");
    }
  } else {
    res.send("not-added");
  }
});

app.post("/login", async (req, res) => {
  const uid = req.body.uid;
  const pass = req.body.password;
  const status = await checkUser(uid);
  if (status.exsist) {
    if (status.password == pass) {
      res.send("good");
    } else {
      res.send("wrong");
    }
  } else {
    res.send("not-exsist");
  }
});

app.post("/contacts", async (req, res) => {
  const uid = req.body.uid;
  const contacts = await getContacts(uid);
  res.send(contacts);
});

app.post("/newcontact", async (req, res) => {
  const cid = req.body.cid;
  const uid = req.body.uid;
  const cname = req.body.cname;
  const res1 = await checkUser(cid);
  if (res1.exsist) {
    setNewContact(uid, cid, cname).then((e) => {
      res.send("added");
    });
  } else {
    res.send("not-registered");
  }
});

app.post("/getchat", (req, res) => {
  const uid = req.body.uid;
  const cid = req.body.cid;
  const date = req.body.date;
  getChat(uid, cid, date).then((chat) => res.send(chat));
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log("[Listening] on port", port);
});

connect(server);
