import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Picker } from "@react-native-picker/picker";


export default function EditMenu() {

  //get itemId and mode from the URL parameters
  const { itemId, mode } =
    useLocalSearchParams();


  const [dishName, setDishName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [course, setCourse] =
    useState("");

  const [price, setPrice] =
    useState("");


  const [loading, setLoading] =
    useState(true);


 //method to load the menu item data when the component mounts
  useEffect(() => {

    const loadItem = async () => {

      try {

        const storedMenu =
          await AsyncStorage.getItem(
            "menuItems"
          );


        if (!storedMenu) {

          Alert.alert(
            "Error",
            "Menu items could not be found.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );

          return;
        }


        const menuItems =
          JSON.parse(storedMenu);


        const selectedItem =
          menuItems.find(
            (item) =>
              item.id.toString() ===
              itemId?.toString()
          );


        if (!selectedItem) {

          Alert.alert(
            "Error",
            "Menu item could not be found.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );

          return;
        }


        // set the form values

        setDishName(
          selectedItem.name || ""
        );

        setDescription(
          selectedItem.description || ""
        );

        setCourse(
          selectedItem.course || ""
        );

        setPrice(
          selectedItem.price
            ? selectedItem.price
                .toString()
                .replace("R", "")
            : ""
        );

// set loading to false after data is loaded
      } catch (error) {

        console.log(
          "There was an error loading the item:",
          error
        );

        Alert.alert(
          "There was an error loading the item."
        );

      } finally {

        setLoading(false);

      }

    };


    loadItem();

  }, [itemId]);


//save function
  const handleSave = async () => {

    if (
      dishName.trim() === "" ||
      description.trim() === "" ||
      course === "" ||
      price.trim() === ""
    ) {

      Alert.alert(
        "There was an error saving the menu item.",
        "Please complete all fields before saving."
      );

      return;
    }


    try {

      // get existing menu

      const storedMenu =
        await AsyncStorage.getItem(
          "menuItems"
        );


      if (!storedMenu) {

        Alert.alert(
          "Error",
          "Menu items could not be found."
        );

        return;
      }


      const menuItems =
        JSON.parse(storedMenu);


      // find the item being edited

      const itemIndex =
        menuItems.findIndex(
          (item) =>
            item.id.toString() ===
            itemId?.toString()
        );


      if (itemIndex === -1) {

        Alert.alert(
          "Error",
          "Menu item could not be found."
        );

        return;
      }


      // get the existing image or use a placeholder if none exists

      const existingImage =
        menuItems[itemIndex].image ||
        "https://via.placeholder.com/80";


      // update the item with the new values  
      menuItems[itemIndex] = {

        ...menuItems[itemIndex],

        id: menuItems[itemIndex].id,

        name: dishName.trim(),

        description:
          description.trim(),

        course: course,

        price:
          price.trim().startsWith("R")
            ? price.trim()
            : `R${price.trim()}`,

        image: existingImage,

      };


      // save the updated menu back to AsyncStorage

      await AsyncStorage.setItem(
        "menuItems",
        JSON.stringify(menuItems)
      );


      console.log(
        "Updated menu:",
        menuItems
      );


      Alert.alert(
        "Great news!",
        "Menu item updated successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/home"),
          },
        ]
      );


    } catch (error) {

      console.log(
        "Update error:",
        error
      );

      Alert.alert(
        "There was an error saving the menu item."
      );

    }
  };


//delete function

  const handleDelete = () => {

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",

      [

        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
// delete the item from AsyncStorage
            try {

              const storedMenu =
                await AsyncStorage.getItem(
                  "menuItems"
                );


              if (!storedMenu) {

                Alert.alert(
                  "Error",
                  "Menu items could not be found."
                );

                return;
              }


              const menuItems =
                JSON.parse(storedMenu);


              // selected items
              const updatedMenu =
                menuItems.filter(
                  (item) =>
                    item.id.toString() !==
                    itemId?.toString()
                );


              // update the menu in AsyncStorage

              await AsyncStorage.setItem(
                "menuItems",
                JSON.stringify(updatedMenu)
              );


              Alert.alert(
                "Deleted",
                "Menu item deleted successfully.",
                [
                  {
                    text: "OK",
                    onPress: () =>
                      router.replace("/home"),
                  },
                ]
              );


            } catch (error) {

              console.log(
                "Delete error:",
                error
              );

              Alert.alert(
                "Error",
                "There was a problem deleting the menu item."
              );

            }

          },
        },

      ]
    );
  };

  //loading state
  if (loading) {

    return (

      <SafeAreaView
        style={styles.container}
      >

        <Text style={styles.loadingText}>
          Item Menu Loading...
        </Text>

      </SafeAreaView>
    );
  }


//determine if the form is in view mode or edit mode
  const isViewMode =
    mode === "view";


  return (

    <SafeAreaView style={styles.container}>

      {/* header */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => router.back()}
        >

          <Text style={styles.backArrow}>
            ←
          </Text>

        </TouchableOpacity>


        <Text style={styles.headerTitle}>

          {isViewMode
            ? "View Menu Item"
            : "Edit Menu Item"}

        </Text>

      </View>


      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >

        {/* name of the dish */}

        <Text style={styles.label}>
          Dish Name
        </Text>

        <TextInput
          style={styles.input}
          value={dishName}
          onChangeText={setDishName}
          editable={!isViewMode}
        />


        {/* description */}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
          editable={!isViewMode}
        />


        {/* course */}

        <Text style={styles.label}>
          Course
        </Text>


        <View
          style={[
            styles.pickerContainer,
            isViewMode &&
              styles.disabledInput,
          ]}
        >

          <Picker
            selectedValue={course}
            onValueChange={(value) =>
              setCourse(value)
            }
            enabled={!isViewMode}
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
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          editable={!isViewMode}
        />


        {/* buttons */}

        {!isViewMode && (

          <>

            <View style={styles.buttonRow}>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >

                <Text style={styles.deleteText}>
                  Delete
                </Text>

              </TouchableOpacity>


              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  router.back()
                }
              >

                <Text style={styles.cancelText}>
                  Cancel
                </Text>

              </TouchableOpacity>

            </View>


            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >

              <Text style={styles.saveText}>
                Save
              </Text>

            </TouchableOpacity>

          </>

        )}

      </ScrollView>

    </SafeAreaView>
  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },

  header: {
    backgroundColor: "#165A50",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backArrow: {
    color: "#fff",
    fontSize: 28,
    marginRight: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 20,
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#ECE7E7",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },

  textArea: {
    backgroundColor: "#ECE7E7",
    borderRadius: 10,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    marginBottom: 15,
  },

  pickerContainer: {
    backgroundColor: "#ECE7E7",
    borderRadius: 20,
    height: 50,
    marginBottom: 15,
    overflow: "hidden",
  },

  picker: {
    height: 50,
    width: "100%",
  },

  disabledInput: {
    opacity: 0.7,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  deleteButton: {
    borderWidth: 1.5,
    borderColor: "#4F5D1D",
    width: "45%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },

  deleteText: {
    color: "#4F5D1D",
    fontWeight: "700",
    fontSize: 18,
  },

  cancelButton: {
    backgroundColor: "#A9BA5A",
    width: "45%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },

  cancelText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  saveButton: {
    backgroundColor: "#4F5D1D",
    height: 55,
    width: 120,
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
  },

});