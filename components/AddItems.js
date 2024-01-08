import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
    collection,
    getDocs,
    addDoc,
    arrayUnion,
    updateDoc,
    doc,
    arrayRemove,
  } from "firebase/firestore";
const AddItems = (props) => {


  const [formData, setFormData] = useState({
    name: "", // Initialize with appropriate default values
    quantity: 0,
    boughtdate: "",
    expirydate: "",
    category:"",
    veg: true, // Default to veg
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const newCategory = formData;
  
    try {
      if (!props.householditems.length) {
        console.error("No existing document to update");
        return;
      }
  
      // Assuming you want to add the new category to the first document in the array
      const firstDocumentId = props.householditems[0].id;
  
      const docRef = doc(db, "householditems", firstDocumentId);
  
      await updateDoc(docRef, {
        categories: arrayUnion(newCategory),
      });
  
      // Update the local state immediately
      props.updateItems((prevItems) => {
        const updatedItems = [...prevItems];
        // Update the categories array of the first document
        updatedItems[0].categories.push(newCategory);
        return updatedItems;
      });
  
      console.log("New category added successfully");
    } catch (error) {
      console.error("Error adding new category: ", error);
    }
  };

  const update = async () => {

    try {
      if (!formData.name) {
        console.error("Name is required for update");
        return;
      }

      const docRef = doc(db, "householditems", "7lJo4W3RGRuZ9zL5a4FW");

      // Find the index of the category to be updated
      const categoryIndex = householditems.findIndex((item) =>
        item.categories.some((category) => category.name === formData.name)
      );

      if (categoryIndex === -1) {
        console.error("Category not found for update");
        return;
      }

      // Update the category in Firestore
      await updateDoc(docRef, {
        categories: arrayRemove(
          householditems[categoryIndex].categories.find(
            (category) => category.name === formData.name
          )
        ),
      });

      await updateDoc(docRef, {
        categories: arrayUnion(formData),
      });

      // Update the state to reflect the changes in the UI
      sethouseholditems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[categoryIndex].categories = updatedItems[
          categoryIndex
        ].categories.map((category) =>
          category.name === formData.name ? formData : category
        );
        return updatedItems;
      });

      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  return (
    <div className="" style={{ border: "1px solid green", padding: "10px" }}>
      <h1>Add Itedddsssssms</h1>
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


      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="food">food</option>
        <option value="electricals">electricals</option>
        <option value="others">others</option>
      </select>

      <button onClick={handleSubmit}>Add Item</button>
      <button onClick={update}>UPDATE</button>
    </div>
  );
};

export default AddItems;
