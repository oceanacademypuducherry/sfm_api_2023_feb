const express = require("express");
const route = express.Router();
const db = require("../config");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} = require("firebase/auth");
const {
  collection,
  getDocs,
  addDoc,
  getDoc,
  setDoc,
  query,
  where,

  doc,
  FieldValue,
} = require("firebase/firestore");

// signup
route.post("/signup", async (req, res) => {
  const auth = getAuth();
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  try {
    if (!username) throw { msg: "invalid username", isSucces: false };
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = { email: userCredential.user.email, username: username };
    const col = doc(db, "Users", userCredential.user.email);
    await setDoc(col, user);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

// login
route.post("/login", async (req, res) => {
  const auth = getAuth();
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const col = doc(db, "Users", userCredential.user.email);
    const userData = await getDoc(col);
    res.status(200).json(userData.data());
  } catch (e) {
    const msg = e;
    console.log(msg);
    if (msg) {
      res.status(302).json(msg);
    }

    res.status(500).json({ msg: e, isSucces: false });
  }
});

route.post("/oauth", async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  try {
    const col = doc(db, "Users", email);

    const userData = await getDoc(col);
    if (userData.exists()) {
      res.status(200).json({ ...userData.data(), isNewUser: false });
    } else {
      const user = { email: email, username: username };
      await setDoc(col, user);
      res.status(200).json({ ...user, isNewUser: true });
    }
  } catch (e) {
    res.status(500).json({ msg: e, isSucces: false });
  }
});

//get data collection
route.post("/get/data_collection", async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) throw "invalid email";
    const docRef = doc(db, "Users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json(docSnap.data());
    } else {
      throw { msg: "user not exists" };
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// set data collection
route.post("/set/data_collection", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  let missions = [];
  let achievements = [];
  try {
    if (!data) throw { msg: "invalid data", isSucces: false };
    if (!email) throw { msg: "invalid email", isSucces: false };

    const misData = await getDoc(doc(db, "Mission", "mission"));
    const achiData = await getDoc(doc(db, "Achievement", "achievement"));

    if (misData.exists()) missions = misData.data();

    if (achiData.exists()) achievements = achiData.data();

    const docRef = doc(db, "Users", email);
    await setDoc(
      docRef,
      {
        ...data,
        missions: missions.missions,
        achievements: achievements.achievements,
        isSubscribed: false,
      },

      { merge: true }
    );
    const allData = (await getDoc(docRef)).data();
    res.status(200).json(allData);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// get backup
route.post("/get/backup", async (req, res) => {
  try {
    // const col = collection(db, "Users", req.body.email);
    const docRef = doc(db, "Users", req.body.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.send(docSnap.data());
    } else {
      throw { msg: "user not exists", isSucces: false };
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

// set backup
route.post("/set/backup", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  try {
    //const col = collection(db, "Users", req.body.email);
    const docRef = doc(db, "Users", email);
    await setDoc(docRef, data, { merge: true });

    res.json({ msg: "Backup completed", isSucces: true });
  } catch (e) {
    res.status(500).json({ msg: e, isSucces: false });
  }
});
route.post("/set/backup", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  try {
    //const col = collection(db, "Users", req.body.email);
    const docRef = doc(db, "Users", email);
    await setDoc(docRef, data, { merge: true });

    res.json({ msg: "Backup completed", isSucces: true });
  } catch (e) {
    res.status(500).json({ msg: e, isSucces: false });
  }
});
route.post("/make/subscribed", async (req, res) => {
  const email = req.body.email;
  const paymentId = req.body.paymentId;
  try {
    const docRef = doc(db, "Users", email);
    const data = await getDoc(docRef);
    console.log("------------------------");

    if (data.exists()) {
      await setDoc(
        docRef,
        { isSubscribed: true, paymentId: paymentId },
        { merge: true }
      );
      res.status(201).json({ message: "purchase completed..." });
    } else {
      throw "email does not exist";
    }

    console.log("------------------------");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
route.post("/get/subscribed", async (req, res) => {
  const email = req.body.email;
  try {
    const docRef = doc(db, "Users", email);
    const data = await getDoc(docRef);
    console.log("------------------------");

    if (data.exists()) {
      let isSub = data.data().isSubscribed ? true : false;
      let paymentId = data.data().paymentId;
      res.status(201).json({ isSubscribed: isSub, paymentId: paymentId });
    } else {
      throw "email does not exist";
    }

    console.log("------------------------");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});
//check
route.post("/check", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  console.log(req.body);
  console.log(data);
  try {
    // const col = collection(db, "Users", req.body.email);
    // const docRef = doc(db, "Users", email);
    // const docSnap = await setDoc(docRef, { ...data });

    res.json({});
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: e, isSucces: false });
  }
});

module.exports = route;
