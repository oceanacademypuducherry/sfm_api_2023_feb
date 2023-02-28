const express = require("express");
const route = express.Router();
const db = require("../config");
const {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
} = require("firebase/firestore");

route.post("/get", async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) res.json({ msg: "require userId" });
    const docRef = doc(db, "Users", email);
    const missionData = await getDoc(docRef);
    const allData = missionData.data();
    if (allData.missions) {
      res.json(allData.missions);
    } else {
      res.json([]);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ mag: e });
  }
});
route.post("/set", async (req, res) => {
  const email = req.body.email;
  const mission = req.body.data;
  try {
    if (!email || !mission)
      throw { msg: "invalid body data ", isSucces: false };
    const docRef = doc(db, "Users", email);
    await setDoc(docRef, { missions: mission }, { merge: true });
    res.status(200).json({ msg: "uploaded successfuly", isSucces: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

// load mission
route.get("/load/to/app", async (req, res) => {
  try {
    const docRef = doc(db, "Mission", "mission");
    const missionData = await getDoc(docRef);
    if (missionData.exists()) {
      res.status(200).json(missionData.data());
    } else {
      throw { mag: "mission not exist", isSucces: false };
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

//admin upload mission
route.post("/db/upload", async (req, res) => {
  const missionData = req.body.data;
  try {
    if (!missionData) throw { mag: "Data is empty", isSucces: false };
    const col = doc(db, "Mission", "mission");
    await setDoc(col, { missions: missionData }, { merge: true });

    res.status(200).json({ mag: "Mission uploaded", isSucces: true });
  } catch (e) {
    res.status(500).json(e);
  }
});
route.post("/add/new/mission/to/db", async (req, res) => {
  const missionData = req.body.data;

  try {
    if (!missionData) throw { mag: "Data is empty", isSucces: false };
    const col = doc(db, "Mission", "mission");

    const oldData = await getDoc(col);
    const allOldMission = oldData.data();
    const allMission = [...allOldMission.missions, ...missionData];

    await setDoc(col, { missions: allMission }, { merge: true });

    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach(async (d) => {
      // doc.data() is never undefined for query doc snapshots
      const col = doc(db, "Users", d.id);
      const oldUserMission = d.data().missions;
      await setDoc(
        col,
        { missions: [...oldUserMission, ...missionData] },
        { merge: true }
      );
    });

    res.status(200).json({
      mag: "Mission uploaded",
      isSucces: true,
      mission: "allMission",
    });
  } catch (e) {
    res.status(500).json();
  }
});

// Remove all missions

route.post("/remove/all/missions", async (req, res) => {
  try {
    const col = doc(db, "Mission", "mission");

    // const oldData = await getDoc(col);
    // const allOldMission = oldData.data();
    // const allMission = [...allOldMission.missions, ...missionData];
    // console.log(allMission);
    await setDoc(col, { missions: [] }, { merge: true });

    const querySnapshot = await getDocs(collection(db, "Users"));
    querySnapshot.forEach(async (d) => {
      const col = doc(db, "Users", d.id);
      await setDoc(col, { missions: [] }, { merge: true });
    });

    res.status(200).json({
      mag: "Mission removed",
      isSucces: true,
    });
  } catch (e) {
    res.status(500).json();
  }
});

module.exports = route;
