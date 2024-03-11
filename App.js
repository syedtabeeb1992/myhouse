import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import AddItems from "./components/AddItems";
import useGetdata from "./components/useGetdata";
import useDeleteItem from "./components/useDeleteItem";
import SimpleModal from "./components/SimpleModal";
import './styles/global.css'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const App = () => {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  const { deleteItem, error } = useDeleteItem();
  const [editData, setEditData] = useState(null); // State to store the data of the clicked item
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal open/close

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

  const handleEditModalOpen = () => {
    setModalOpen(true);
  };

  const edit = (response) => {

    setEditData(response);
    setModalOpen(true); 
  };

  const handleCloseModal = () => {
    setModalOpen(false); 
  };

  const handleOpeneModal = () => {
    setModalOpen(true);
  };

  return (
    <div>

      <Fab className="custom-fab" onClick={handleOpeneModal} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <SimpleModal
        open={modalOpen}
        handleCloseModal={handleCloseModal}
        householditems={householditems}
        updateItems={updateHouseholdItems}
        editData={editData}
        handleEditModalOpen={handleEditModalOpen} 
      />
{householditems.map((items, index) => {
  if (items.categories && Array.isArray(items.categories)) {
    return items.categories.map((response, subIndex) => {

      return (
        <div key={`${items.id}-${subIndex}`}>
          <h1>{response.name}</h1>
          <p>Bought on - {response.boughtdate}</p>
          <p>Expiring on - {response.expirydate}</p>
          <p>Quantity - {response.quantity}</p>
          <p>Days to Expire : {response.daysToExpire}</p>
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
