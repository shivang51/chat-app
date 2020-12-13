const admin = require("firebase-admin");
const { v4: uuid } = require("uuid");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function getUserData(id) {
  return new Promise((data) => {
    db.collection("users")
      .doc(id)
      .get()
      .then((doc) => data(doc.data()));
  });
}

function getContacts(id) {
  return new Promise((resolve) => {
    let contacts = [];

    db.collection("users")
      .doc(id)
      .collection("contacts")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          contacts.push({ id: doc.id, ...doc.data() });
        });
        resolve(contacts);
      });
  });
}

async function getChat(uid, cid, date) {
  let chat = [];
  if (date === "latest") {
    let time = await getLatest(uid, cid);
    time = time.time;
    date = new Date(time);
    date =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }
  const chatRef = db
    .collection("users")
    .doc(uid)
    .collection("contacts")
    .doc(cid)
    .collection("chat")
    .doc("text")
    .collection(date);

  return new Promise((resolve) => {
    chatRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        chat.push(doc.data());
      });
      resolve(chat);
    });
  });
}

function setNewUser(uid, data) {
  const userRef = db.collection("users");

  return new Promise((status) => {
    userRef
      .doc(uid)
      .set(data)
      .then((e) => status("done"));
  });
}

function checkUser(uid) {
  return new Promise(async (status) => {
    const snapshot = await db
      .collection("users")
      .where("__name__", "==", uid)
      .get();
    if (snapshot.empty) {
      console.log("no");
      status({ exsist: false });
    } else {
      const pass = snapshot.docs[0].data().password;
      status({ exsist: true, password: pass });
    }
  });
}

function setNewContact(uid, cid, cname) {
  const contactRef = db.collection("users").doc(uid).collection("contacts");

  return new Promise((status) => {
    contactRef
      .doc(cid)
      .set({ savedName: cname })
      .then((e) => status("done"));
  });
}

async function newMessage(uid, cid, msg, time, type) {
  const date = new Date(time);
  const messageRef = db
    .collection("users")
    .doc(uid)
    .collection("contacts")
    .doc(cid)
    .collection("chat")
    .doc("text")
    .collection(
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    )
    .doc(uuid());

  const latestRef = db
    .collection("users")
    .doc(uid)
    .collection("contacts")
    .doc(cid)
    .collection("chat")
    .doc("latest");

  await latestRef.set({ msg: msg, time: time, type: type });

  return new Promise((resolve) => {
    messageRef
      .set({ msg: msg, time: time, type: type })
      .then((e) => resolve("done"));
  });
}

function getLatest(uid, cid) {
  const latestRef = db
    .collection("users")
    .doc(uid)
    .collection("contacts")
    .doc(cid)
    .collection("chat")
    .doc("latest");

  return new Promise((resolve) => {
    latestRef.get().then((snapshot) => {
      resolve(snapshot.data());
    });
  });
}

exports.getLatest = getLatest;
exports.getUserData = getUserData;
exports.getContacts = getContacts;
exports.getChat = getChat;
exports.setNewUser = setNewUser;
exports.checkUser = checkUser;
exports.setNewContact = setNewContact;
exports.newMessage = newMessage;
