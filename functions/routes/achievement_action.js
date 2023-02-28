const express = require("express");
const db = require("../config");
const { collection, setDoc, getDoc, doc } = require("firebase/firestore");

const router = express.Router();

//admin Achievement upload to db
router.post("/db/upload", async (req, res) => {
  const data = req.body.data;
  try {
    if (!data) throw { isSucces: false, msg: "data is empty" };
    const docRef = doc(db, "Achievement", "achievement");
    await setDoc(docRef, { achievements: data, isUpdated: true });
    res
      .status(201)
      .json({ isSucces: false, msg: "Achievement Data is uploaded" });
  } catch (e) {
    res.status(500).json(e);
  }
});

// load to app
router.get("/load/to/app", async (req, res) => {
  try {
    const docRef = doc(db, "Achievement", "achievement");
    const allData = await getDoc(docRef);
    if (allData.exists()) {
      res.status(200).json(allData.data());
    } else {
      res.status(200).json({ achievements: [], isUpdated: false });
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//admin update
router.post("/update/by/user", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  try {
    if (!email) throw { msg: "email is invalid", isSucces: false };
    if (!data) throw { msg: "Data is Invalid", isSucces: false };
    const docRef = doc(db, "Users", email);
    await setDoc(docRef, { achievements: data }, { merge: true });
    res
      .status(201)
      .json({ msg: "achievements Updated succesfuly", isSucces: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
