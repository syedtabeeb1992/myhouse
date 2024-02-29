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

    console.log("props", props.householditems);

    try {
      // Check if the category name is provided
      if (!formData.name) {
        console.error("Name is required for update");
        return;
      }
  
      // Find the index of the category to update in the householditems array
      const categoryIndex = props.householditems.findIndex((item) =>
        item.categories.some((category) => category.name === formData.name)
      );

      // Check if the category exists
      if (categoryIndex === -1) {
        console.error("Category not found for update");
        return;
      }
  
      // Get the document reference for the Firestore document
      // Here, you might need a dynamic document ID instead of hardcoding "7lJo4W3RGRuZ9zL5a4FW"
      const docRef = doc(db, "householditems", "7lJo4W3RGRuZ9zL5a4FW");
  
      // Remove the existing category from Firestore using arrayRemove
      await updateDoc(docRef, {
        categories: arrayRemove(props.householditems[categoryIndex].categories[0]), // Remove the entire category object
      });
  
      // Add the updated category to Firestore using arrayUnion
      await updateDoc(docRef, {
        categories: arrayUnion({ ...formData }), // Add the updated category object
      });
  
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category: ", error);
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
