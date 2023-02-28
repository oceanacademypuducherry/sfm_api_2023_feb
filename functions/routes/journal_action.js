const express = require("express");
const db = require("../config");
const { collection, setDoc, getDoc, doc } = require("firebase/firestore");

const router = express.Router();

// update journal
router.post("/add", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  try {
    if (!email) throw { msg: "email is invalid", isSucces: false };
    if (!data) throw { msg: "Data is Invalid", isSucces: false };
    const docRef = doc(db, "Users", email);
    await setDoc(docRef, { journals: data }, { merge: true });
    res.status(201).json({ msg: "Journal Updated succesfuly", isSucces: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

//get all journal
router.post("/get", async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) throw { msg: "email is invalid", isSucces: false };
    const docRef = doc(db, "Users", email);
    const allInfo = await getDoc(docRef);
    const allJournal = allInfo.data();
    if (allInfo.exists()) {
      res.status(200).json(allJournal.journals);
    } else {
      res.status(200).json([]);
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
