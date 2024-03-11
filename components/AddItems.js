import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker } from "@mui/x-date-pickers";

import "./AddItems.css";
const AddItems = (props) => {
  const [formData, setFormData] = useState({
    name: "", // Initialize with appropriate default values
    quantity: 0,
    boughtdate: "",
    expirydate: "",
    veg: true, // Default to veg
  });

  useEffect(() => {
    setFormData(
      props.editData || {
        name: "",
        quantity: 0,
        boughtdate: "",
        expirydate: "",
        veg: true,
      }
    );
  }, [props.editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "veg" ? e.target.value === "veg" : e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const formDataForUpdate = {
    name: formData.name,
    quantity: formData.quantity,
    boughtdate: formData.boughtdate,
    expirydate: formData.expirydate,
    veg: formData.veg,
  };

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, "householditems/7lJo4W3RGRuZ9zL5a4FW");

      const docSnapshot = await getDoc(docRef);
      const currentData = docSnapshot.data().categories || [];

      const updatedData = [...currentData, formDataForUpdate];

      console.log(formDataForUpdate);

      await updateDoc(docRef, { categories: updatedData });

      props.updateItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[0].categories.push(formDataForUpdate);
        console.log("updated", updatedItems);
        return updatedItems;
      });

      props.handleCloseModal();

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

  const handleDateChange = (date, type) => {
    if (!date) return;
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const formattedDate = `${day.toString().padStart(2, "0")} / ${month
      .toString()
      .padStart(2, "0")} / ${year}`;
    console.log("selected date", formattedDate);
    const istOffset = 330 * 60 * 1000;
    const istDate = new Date(selectedDate.getTime() + istOffset);

    if (type === "boughtdate") {
      setFormData((prevData) => ({
        ...prevData,
        boughtdate: formattedDate,
      }));
    } else if (type === "expirydate") {
      setFormData((prevData) => ({
        ...prevData,
        expirydate: formattedDate,
      }));
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
      const selectedItemIndex = props.householditems.findIndex((item) =>
        item.categories.some((category) => category.name === formData.name)
      );

      if (selectedItemIndex === -1) {
        console.error("Selected item not found");
        return;
      }

      // Create a copy of the householditems array to avoid mutating state directly
      const updatedItems = [...props.householditems];

      // Update the selected item's data in the local state
      updatedItems[selectedItemIndex].categories.forEach((category) => {
        if (category.name === formData.name) {
          category.name === formData.name;
          category.quantity = formData.quantity;
          category.boughtdate = formData.boughtdate;
          category.expirydate = formData.expirydate;
          category.veg = formData.veg;
        }
      });

      // Update the selected item's data in Firebase
      const docRef = doc(db, "householditems", "7lJo4W3RGRuZ9zL5a4FW"); // Update with the correct document ID
      await updateDoc(docRef, {
        categories: updatedItems[selectedItemIndex].categories,
      });

      // Update the local state with the updated items array
      props.updateItems(updatedItems);

      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <div className="">
      <div className="text-fields-wrapper">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name of the item"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              label="Quantity"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(date) => handleDateChange(date, "boughtdate")}
                label="select date"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(date) => handleDateChange(date, "expirydate")}
                label="select date"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select name="veg" value={formData.veg} onChange={handleChange}>
                <MenuItem value="veg">Veg</MenuItem>
                <MenuItem value="nonVeg">Non-Veg</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Add Item
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="contained" onClick={handleUpdate}>
              UPDATE
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AddItems;


