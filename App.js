// App.js

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import AddItems from "./components/AddItems";
import useGetdata from "./components/useGetdata";
import useDeleteItem from "./components/useDeleteItem";

const App = () => {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  const { deleteItem, error } = useDeleteItem();
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null); // State to store the data of the clicked item

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
    console.log(response);
    setModal(true);
    setEditData(response); // Set the data of the clicked item
  };

  return (
    <div>
      {householditems.map((items) => {
        if (items.categories && Array.isArray(items.categories)) {
          return items.categories.map((response) => (
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
          ));
        }
        return null;
      })}

      {modal ? (
        <div className="modal">
          <h1>THIS IS A MODAL</h1>

          <AddItems
            householditems={householditems}
            updateItems={updateHouseholdItems}
            editData={editData}
          />

          <button onClick={() => setModal(false)}>close</button>
        </div>
      ) : (
        <>{/* your other content here */}</>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
