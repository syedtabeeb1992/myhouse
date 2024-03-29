import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import AddItems from "./components/AddItems";
import useGetdata from "./components/useGetdata";
import useDeleteItem from "./components/useDeleteItem";
import SimpleModal from "./components/SimpleModal";
import "./styles/global.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Margin } from "@mui/icons-material";

const App = () => {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  const { deleteItem, error } = useDeleteItem();
  const [editData, setEditData] = useState(null); // State to store the data of the clicked item
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal open/close
  const [searchQuery, setSearchQuery] = useState("");

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

    console.log("EDIT RESPONSE", response);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpeneModal = () => {
    setModalOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDateFromMilliseconds = (milliseconds) => {
    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);

    // Get the components of the date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();

    // Format the date components as DD/MM/YYYY
    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;

    return formattedDate;
  };

  const expirydate = (milliseconds) => {
    // Get the current date in milliseconds
    const currentDate = new Date().getTime();

    // Calculate the difference in milliseconds between the expiry date and the current date
    const timeDifference = milliseconds - currentDate;

    // Convert milliseconds to days
    const daysToExpire = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysToExpire;
  };

  return (
    <div>
      <Fab
        className="custom-fab"
        onClick={handleOpeneModal}
        color="primary"
        aria-label="add"
      >
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

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="searchBox"
      />
      <div className="wrapperItems">
        {householditems
          .filter((items) => {
            return items.categories.some((response) =>
              response.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
          .map((items, index) => {
            if (items.categories && Array.isArray(items.categories)) {
              return items.categories.map((response, subIndex) => {
                return (
                  <div className="card" key={`${items.id}-${subIndex}`}>
                    <h1>{response.name}</h1>
                    <p>
                      Bought on -{" "}
                      {formatDateFromMilliseconds(response.boughtdate)}
                    </p>
                    <p>
                      Expiring on -{" "}
                      {formatDateFromMilliseconds(response.expirydate)}
                    </p>
                    <p>Quantity - {response.quantity}</p>

                    <p>Expires in - {expirydate(response.expirydate)} Days</p>

                    <button
                      onClick={() => deleteItems(response.name, items.id)}
                    >
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

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
