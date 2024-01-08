import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import AddItems from "./components/AddItems";
import useGetdata from "./components/useGetdata";

import {
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase-config";
import useDeleteItem from "./components/useDeleteItem";

const App = () => {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  const { deleteItem, error } = useDeleteItem();
  
  useEffect(() => {
    setHouseholdItems(householditemsData);
  }, [householditemsData]);
  const updateHouseholdItems = (newItems) => {
    setHouseholdItems(newItems);
  };
  const deleteItems = async (itemName, documentId) => {
    try {
      if (!documentId || !householditems) {
        console.error("Invalid documentId or householditems");
        return;
      }
      await deleteItem(itemName, documentId, householditems, setHouseholdItems);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  
  const edit = (response) => {


    setFormData((prevData) => ({
      ...prevData,
      name: response.name || prevData.name,
      quantity: response.quantity || prevData.quantity,
      boughtdate: response.boughtdate || prevData.boughtdate,
      expirydate: response.expirydate || prevData.expirydate,
      veg: response.veg !== undefined ? response.veg : prevData.veg,
    }));
  };

  return (
    <div>
      <AddItems
        householditems={householditems}
        updateItems={updateHouseholdItems}
      />

{householditems.map((items) => {
    if (items.categories && Array.isArray(items.categories)) {
      return items.categories.map((response) => (
        <div key={response.name}>
          <h1>{response.name}</h1>
          <p>Bought on - {response.boughtdate}</p>
          <p>Expiring on - {response.expirydate}</p>
          <p>Quantity - {response.quantity}</p>
          <p>Quantity - {response.category}</p>
          <button
                onClick={() => deleteItems(response.name, items.id)}
              >
                Delete
              </button>
          <button onClick={() => edit(response)}>EDIT</button>
        </div>
      ));
    }
    return null;
  })}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
