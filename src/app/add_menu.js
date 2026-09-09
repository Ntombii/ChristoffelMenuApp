import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import { Picker } from "@react-native-picker/picker";


export default function AddMenu() {

  const router = useRouter();

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");


//clear form function
  const clearForm = () => {

    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");

  };



//cancel function
  const handleCancel = () => {

    router.back();

  };


//save function
  const handleSave = async () => {

    if (
      dishName.trim() === "" ||
      description.trim() === "" ||
      course === "" ||
      price.trim() === ""
    ) {

      Alert.alert("Missing Fields",
        "Kindly fill in all fields."
      );

      return;
    }

//create new item object
    const newItem = {

      id: Date.now().toString(),

      name: dishName.trim(),

      description: description.trim(),

      course: course,

      price: price.trim().startsWith("R")
        ? price.trim()
        : `R${price.trim()}`,

      image: require("../../assets/images/logo.png"),

    };


    try {

      // Get current menu
      const existingData =
        await AsyncStorage.getItem("menuItems");


      let menuItems = [];

      if (existingData) {

        const parsedData =
          JSON.parse(existingData);

        if (Array.isArray(parsedData)) {

          menuItems = parsedData;

        }

      }


      // Add new item
      menuItems.push(newItem);


      // Save complete updated array
      await AsyncStorage.setItem(
        "menuItems",
        JSON.stringify(menuItems)
      );


      console.log(
        "Saved menu:",
        menuItems
      );

      Alert.alert("Success",
        "Menu item saved successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );


    } catch (error) {

      console.log(
        "Save error:",
        error
      );
     // Show an alert to the user
      Alert.alert(
        "Error",
        "Something went wrong while saving the menu item."
      );

    }

  };
  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          Add Menu
        </Text>

      </View>

      <Text style={styles.label}>
        Dish Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter dish name"
        value={dishName}
        onChangeText={setDishName}
      />
      {/* description */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        placeholder="Enter description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      {/* course  */}

      <Text style={styles.label}>
        Course
      </Text>
  {/*Picker for course selection*/}
      <View style={styles.pickerContainer}>

        <Picker
          selectedValue={course}
          onValueChange={(value) =>
            setCourse(value)
          }
          style={styles.picker}
        >

          <Picker.Item
            label="Select course"
            value=""
          />

          <Picker.Item
            label="Starter"
            value="Starter"
          />

          <Picker.Item
            label="Mains"
            value="Mains"
          />

          <Picker.Item
            label="Dessert"
            value="Dessert"
          />

        </Picker>

      </View>


      {/* price */}

      <Text style={styles.label}>
        Price
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />


      {/* buttons */}

      <View style={styles.row}>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearForm}
        >

          <Text style={styles.clearText}>
            Clear
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >

          <Text style={styles.buttonText}>
            Cancel
          </Text>

        </TouchableOpacity>

      </View>


      {/* save button */}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >

        <Text style={styles.buttonText}>
          Save
        </Text>

      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  header: {
    backgroundColor: "#0F4F4B",
    padding: 20,
    marginBottom: 25,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },

  label: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F5F1F1",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    elevation: 2,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 15,
  },

  pickerContainer: {
    backgroundColor: "#F5F1F1",
    borderRadius: 12,
    height: 50,
    marginBottom: 15,
    elevation: 2,
    overflow: "hidden",
  },

  picker: {
    height: 50,
    width: "100%",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  clearButton: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 15,
    width: "45%",
    alignItems: "center",
    padding: 14,
  },

  clearText: {
    color: "#5A6E15",
    fontWeight: "600",
    fontSize: 18,
  },

  cancelButton: {
    backgroundColor: "#B5C865",
    borderRadius: 15,
    width: "45%",
    alignItems: "center",
    padding: 14,
  },

  saveButton: {
    backgroundColor: "#4E620E",
    borderRadius: 15,
    alignItems: "center",
    padding: 15,
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

});