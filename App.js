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

const App = () => {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  useEffect(() => {
    setHouseholdItems(householditemsData);
  }, [householditemsData]);
  const updateHouseholdItems = (newItems) => {
    setHouseholdItems(newItems);
  };

  const deleteItems = async (itemName, documentId) => {


    try {
      // Remove the item from Firestore
      const docRef = doc(db, "householditems", documentId);
      await updateDoc(docRef, {
        categories: arrayRemove(
          householditems
            .find((item) => item.id === documentId)
            .categories.find((category) => category.name === itemName)
        ),
      });

      // Update the state to reflect the changes in the UI
      // sethouseholditems((prevItems) => {
      //   const updatedItems = prevItems.map((item) => {
      //     if (item.id === documentId && item.categories) {
      //       item.categories = item.categories.filter(
      //         (category) => category.name !== itemName
      //       );
      //     }
      //     return item;
      //   });
      //   return updatedItems;
      // });

      console.log(`Deleted item with name: ${itemName}`);
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
          return items.categories.map((response) => {
            return (
              <div key={response.name}>
                <h1>{response.name}</h1>
                <p>Bought on - {response.boughtdate}</p>
                <p>Expiring on - {response.expirydate}</p>
                <p>Quantity - {response.quantity}</p>
                <button onClick={() => deleteItems(response.name, items.id)}>
                  Delete
                </button>
                <button onClick={() => edit(response)}>EDIT</button>
              </div>
            );
          });
        }
        return null;
      })}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
