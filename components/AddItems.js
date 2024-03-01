import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase-config";

const AddItems = (props) => {
  const [formData, setFormData] = useState({
    name: "", // Initialize with appropriate default values
    quantity: 0,
    boughtdate: "",
    expirydate: "",
    veg: true, // Default to veg
  });

  useEffect(() => {
    setFormData(props.editData || {
      name: "",
      quantity: 0,
      boughtdate: "",
      expirydate: "",
      veg: true,
    });
  }, [props.editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = async () => {
    try {
      const docRef = doc(db, "householditems", "7lJo4W3RGRuZ9zL5a4FW");

      await updateDoc(docRef, {
        categories: arrayUnion(formData),
      });

      props.updateItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[0].categories.push(formData);
        return updatedItems;
      });

      console.log("New item added successfully");
      setFormData({
        name: "",
        quantity: 0,
        boughtdate: "",
        expirydate: "",
        veg: true,
      });
    } catch (error) {
      console.error("Error adding new item: ", error);
    }
  };



  const handleUpdate = async () => {
    try {
      // Ensure the formData contains a valid name (you can add more validation if needed)
      if (!formData.name) {
        console.error("Name is required for update");
        return;
      }
  
      // Identify the selected item in the householditems array
      const selectedItemIndex = props.householditems.findIndex(item =>
        item.categories.some(category => category.name === formData.name)
      );
  
      if (selectedItemIndex === -1) {
        console.error("Selected item not found");
        return;
      }
  
      // Create a copy of the householditems array to avoid mutating state directly
      const updatedItems = [...props.householditems];
  
      // Update the selected item's data in the local state
      updatedItems[selectedItemIndex].categories.forEach(category => {
        if (category.name === formData.name) {
          category.name === formData.name
          category.quantity = formData.quantity;
          category.boughtdate = formData.boughtdate;
          category.expirydate = formData.expirydate;
          category.veg = formData.veg;
        }
      });



     
  
      // Update the selected item's data in Firebase
      const docRef = doc(db, "householditems", "7lJo4W3RGRuZ9zL5a4FW"); // Update with the correct document ID
      await updateDoc(docRef, { categories: updatedItems[selectedItemIndex].categories });
  
      // Update the local state with the updated items array
      props.updateItems(updatedItems);
  
      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };



  

  return (
    <div className="" style={{ border: "1px solid green", padding: "10px" }}>
      <h1>Add Item</h1>
      <input
        type="text"
        placeholder="Name of the item"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Quantity"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Bought Date"
        name="boughtdate"
        value={formData.boughtdate}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Expiry date"
        name="expirydate"
        value={formData.expirydate}
        onChange={handleChange}
      />
      <select name="veg" value={formData.veg} onChange={handleChange}>
        <option value="veg">Veg</option>
        <option value="nonVeg">Non-Veg</option>
      </select>

      <button onClick={handleSubmit}>Add Item</button>
      <button onClick={handleUpdate}>UPDATE</button>
    </div>
  );
};

export default AddItems;
