const express = require("express");
const db = require("../config");
const { collection, setDoc, getDoc, doc } = require("firebase/firestore");
const router = express.Router();

router.post("/get", async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) throw { msg: "email is invalid", isSucces: false };
    const docRef = doc(db, "Users", email);
    const allInfo = await getDoc(docRef);
    const allJournal = allInfo.data();
    if (allInfo.exists()) {
      res.status(200).json(allJournal.cravings);
    } else {
      res.status(200).json([]);
    }
  } catch (e) {
    res.status(500).json(e);
  }
});
router.post("/add", async (req, res) => {
  const email = req.body.email;
  const data = req.body.data;
  try {
    if (!email) throw { msg: "email is invalid", isSucces: false };
    if (!data) throw { msg: "Data is Invalid", isSucces: false };
    const docRef = doc(db, "Users", email);

    await setDoc(docRef, { cravings: data }, { merge: true });

    // const setdata = await getDoc(docRef);
    // if (setdata.exists()) {
    //   let journalData = setdata.data();
    //   if ("journals" in journalData) {
    //     res.status(201).json({ journals: journalData.journals });
    //   }
    // }

    res
      .status(201)
      .json({ msg: "Cravings Updated succesfuly", isSucces: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
