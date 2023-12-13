import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase-config";

const useGetdata = () => {
  const [householditems, sethouseholditems] = useState([]);

  const collectionRef = collection(db, "householditems");
  const getdata = async () => {
    console.log("API CALEED");
    const data = await getDocs(collectionRef);
    sethouseholditems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getdata();
  }, []);

  return householditems;
};

export default useGetdata;
