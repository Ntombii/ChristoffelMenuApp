import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

//for my font 
import { useFonts } from 'expo-font';
import {
  InstrumentSerif_400Regular,
} from '@expo-google-fonts/instrument-serif';

//my default menu data
const defaultMenuData = [
  {
    id: "1",
    name: "Butternut Soup with Shrimp",
    price: "R130.00",
    course: "Starter",
    description:
      "Roasted & topped with pan-seared shrimp",
     image: require("../../assets/images/butter.jpeg"),
    
  },

  {
    id: "2",
    name: "Bone Marrow Steak",
    price: "R380.00",
    course: "Mains",
    description:
      "200g rump topped with bone marrow-infused butter",
    image: require("../../assets/images/bone.jpeg"),
  },

  {
    id: "3",
    name: "Crème Brûlée",
    price: "R78.00",
    course: "Dessert",
    description:
      "Silky smooth custard topped with caramelised sugar",
    image: require("../../assets/images/creme.jpeg"),
  },
];


//my home screen
export default function HomeScreen() {

  //font loading
  const [fontsLoaded] = useFonts({
    InstrumentSerif: InstrumentSerif_400Regular,
  });

  const router = useRouter();

  const [menuData, setMenuData] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedCourse, setSelectedCourse] =
    useState("All Courses");

//method to load menu data from AsyncStorage
  const loadMenuData = async () => {
    try {
      const storedMenu =
        await AsyncStorage.getItem("menuItems");

      if (storedMenu) {
        const savedMenu =
          JSON.parse(storedMenu);

        if (Array.isArray(savedMenu)) {
          setMenuData(savedMenu);
        } else {
          setMenuData(defaultMenuData);
        }
      } else {
        // First time opening app
        await AsyncStorage.setItem(
          "menuItems",
          JSON.stringify(defaultMenuData)
        );

        setMenuData(defaultMenuData);
      }
    } catch (error) {
      console.log(
        "There was an error loading the menu:",
        error
      );

      setMenuData(defaultMenuData);
    }
  };


//useFocusEffect to load menu data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadMenuData();
    }, [])
  );

 //return null if fonts are not loaded yet
  if (!fontsLoaded) {
    return null;
  }

//method to change course filter
  const changeCourse = () => {
    if (selectedCourse === "All Courses") {
      setSelectedCourse("Starter");
    } else if (selectedCourse === "Starter") {
      setSelectedCourse("Mains");
    } else if (selectedCourse === "Mains") {
      setSelectedCourse("Dessert");
    } else {
      setSelectedCourse("All Courses");
    }
  };


//filter menu data based on search and selected course
  const filteredMenu = menuData.filter((item) => {

    const itemName = item.name || "";

    const itemDescription =
      item.description || "";

    const itemCourse =
      item.course || "";


    const matchesSearch =
      itemName
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      itemDescription
        .toLowerCase()
        .includes(search.toLowerCase());


    const matchesCourse =
      selectedCourse === "All Courses" ||
      itemCourse === selectedCourse;


    return (
      matchesSearch &&
      matchesCourse
    );
  });


 //method to render each menu item
  const renderItem = ({ item }) => (

    <View style={styles.card}>

     <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image}
      />


      <View style={styles.cardContent}>

        <View style={styles.row}>

          <Text style={styles.title}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            {item.price}
          </Text>

        </View>


        <Text style={styles.description}>
          {item.description}
        </Text>


        <View style={styles.courseTag}>

          <Text style={styles.courseText}>
            {item.course}
          </Text>

        </View>


        <View style={styles.actions}>

          {/*button view*/}

          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() =>
              router.push({
                pathname: "/edit_menu",
                params: {
                  itemId: item.id,
                  mode: "view",
                },
              })
            }
          >

            <Text style={styles.viewText}>
              View
            </Text>

          </TouchableOpacity>


          {/* edit button */}

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              router.push({
                pathname: "/edit_menu",
                params: {
                  itemId: item.id,
                  mode: "edit",
                },
              })
            }
          >

            <Text style={styles.btnText}>
              Edit
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </View>
  );



//return the main view
  return (

    <View style={styles.container}>

      {/* header */}

      <View style={styles.header}>
        
        {/* logo and title */}
        <Image source={require('../../assets/images/logo.png')}
        style={styles.logo} />

        <Text style={styles.headerTitle}>
          Christoffel's Restaurant Menu
        </Text>

      </View>


      {/* search */}

      <TextInput
        style={styles.search}
        placeholder="Search menu items..."
        value={search}
        onChangeText={setSearch}
      />


      {/* filter */}

      <View style={styles.filterRow}>

        <Text style={styles.filterLabel}>
          Filter by course:
        </Text>


        <TouchableOpacity
          style={styles.dropdown}
          onPress={changeCourse}
        >

          <Text>
            {selectedCourse} ▼
          </Text>

        </TouchableOpacity>

      </View>


      {/* this is the menu list */}

      <FlatList
        data={filteredMenu}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        extraData={menuData}

        ListEmptyComponent={() => (

          <View style={styles.emptyContainer}>

            <Text style={styles.emptyText}>
              The menu item you're looking for is not available.
            </Text>

          </View>

        )}
      />


      {/* adding new item */}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: "/add_menu",
            params: {
              mode: "add",
            },
          })
        }
      >

        <Text style={styles.addButtonText}>
           Add New Item
        </Text>

      </TouchableOpacity>

      {/* my menu statistics */}
      <TouchableOpacity
        style={styles.statsButton}
        onPress={() => router.push("/menu_stats")}
      >
        <Text style={styles.statsButtonText}>
          Menu Stats
        </Text>
      </TouchableOpacity>

    
    </View>
  );
}

//my styles

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },

  header: {
    backgroundColor: "#0F4F4B",
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
  },
 logo: {
    color: "#fff",
    width:100,
    height:60,
    marginRight:30,
    alignItems: "center",
    justifyContent: "right",
    textAlign: "right",
    backgroundColor:"#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
   headerTitle: {
    color: "#fff",
    fontSize: 22,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "right",
    marginTop: 5,
    fontWeight: "600",
    fontFamily: "InstrumentSerif",
  },

  search: {
    backgroundColor: "#EFEFEF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    alignItems: "center",
  },

  filterLabel: {
    fontSize: 18,
  },

  dropdown: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },

  cardContent: {
    flex: 1,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "700",
    flex: 1,
    fontSize: 15,
    fontFamily: "InstrumentSerif",
  },

  price: {
    fontWeight: "600",
    marginLeft: 5,
  },

  description: {
    color: "#666",
    marginVertical: 5,
  },

  courseTag: {
    backgroundColor: "#B5C865",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  courseText: {
    color: "#fff",
  },

  actions: {
    flexDirection: "row",
  },

  viewBtn: {
    borderWidth: 1,
    borderColor: "#5A6E15",
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 10,
  },

  editBtn: {
    backgroundColor: "#5A6E15",
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  viewText: {
    color: "#5A6E15",
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#D97B20",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    padding: 30,
  },

  emptyText: {
    fontSize: 16,
    color: "#777",
  },
  statsButton: {
  backgroundColor: "#0F4F4B",
  padding: 16,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 10,
  marginBottom: 20,
},

statsButtonText: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "bold",
},
});