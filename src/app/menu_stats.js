
import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

// Menu Statistics Screen

export default function MenuStatsScreen() {

  const router = useRouter();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load menu data from AsyncStorage

  const loadMenuData = async () => {

    try {

      setLoading(true);

      const storedMenu =
        await AsyncStorage.getItem("menuItems");

      if (storedMenu) {

        const savedMenu = JSON.parse(storedMenu);

        setMenuData(
          Array.isArray(savedMenu) ? savedMenu : []
        );

      } else {

        setMenuData([]);

      }

    } catch (error) {

      console.log(
        "Error loading menu statistics:",
        error
      );

      setMenuData([]);

    } finally {

      setLoading(false);

    }
  };

  // Reload statistics whenever the screen is focused

  useFocusEffect(
    useCallback(() => {
      loadMenuData();
    }, [])
  );

  // Convert prices such as R130.00 into numbers

  const getPrice = (price) => {

    const numericPrice = Number(
      String(price || "").replace(/[^\d.-]/g, "")
    );

    return Number.isFinite(numericPrice)
      ? numericPrice
      : null;
  };

  // Calculate total number of menu items

  const totalItems = menuData.length;

  // Calculate average price across all menu items

  const validPrices = menuData
    .map(item => getPrice(item.price))
    .filter(price => price !== null);

  const totalPrice = validPrices.reduce(
    (sum, price) => sum + price,
    0
  );

  const averagePrice =
    validPrices.length > 0
      ? totalPrice / validPrices.length
      : 0;

  // Define menu courses

  const courses = [
    {
      name: "Starters",
      value: "Starter",
      color: "#0F6B4B",
      icon: "🥗",
    },
    {
      name: "Mains",
      value: "Mains",
      color: "#D97B20",
      icon: "🍽️",
    },
    {
      name: "Desserts",
      value: "Dessert",
      color: "#8B72A8",
      icon: "🍰",
    },
  ];

  // Calculate item count and average price for each course

  const courseStats = courses.map(course => {

    const courseItems = menuData.filter(
      item =>
        String(item.course || "").toLowerCase() ===
        course.value.toLowerCase()
    );

    const coursePrices = courseItems
      .map(item => getPrice(item.price))
      .filter(price => price !== null);

    const courseTotal = coursePrices.reduce(
      (sum, price) => sum + price,
      0
    );

    const courseAverage =
      coursePrices.length > 0
        ? courseTotal / coursePrices.length
        : 0;

    const percentage =
      totalItems > 0
        ? (courseItems.length / totalItems) * 100
        : 0;

    return {
      ...course,
      count: courseItems.length,
      average: courseAverage,
      percentage,
    };
  });

  // Return to home screen

  const goBack = () => {
    router.back();
  };

  // Main screen

  return (

    <View style={styles.container}>

      {/* Restaurant header */}

      <View style={styles.header}>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.headerTitle}>
          Christoffel's Restaurant Menu
        </Text>

      </View>

      {/* Page heading */}

      <View style={styles.pageHeader}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
        >

          <Text style={styles.backText}>
            ‹
          </Text>

        </TouchableOpacity>

        <View style={styles.headingContent}>

          <Text style={styles.pageTitle}>
            Menu Statistics
          </Text>

        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {loading ? (

          <Text style={styles.loadingText}>
            Loading menu statistics...
          </Text>

        ) : (

          <>

            {/* sum of menu items */}

            <View style={styles.totalCard}>

              <View>
                <Text style={styles.totalLabel}>
                  Total Dishes on the Menu
                </Text>

                <Text style={styles.totalValue}>
                  {totalItems}
                </Text>
               
              </View>

            </View>

            {/* average price menu */}

            <View style={styles.averageCard}>

              <Text style={styles.averageLabel}>
                Average Menu Price
              </Text>

              <Text style={styles.averageValue}>
                R{averagePrice.toFixed(2)}
              </Text>


            </View>


            {/* av price per course */}

            <View style={styles.sectionHeader}>

              <Text style={styles.sectionTitle}>
                Average Prices by Course
              </Text>

              <Text style={styles.sectionSubtitle}>
                Average price of menu items for each course
              </Text>

            </View>

            {courseStats.map(course => (

              <View
                key={course.value + "-price"}
                style={styles.priceCard}
              >

                <View>

                  <Text style={styles.priceCourseName}>
                    {course.name}
                  </Text>

                  <Text style={styles.priceItemCount}>
                    {course.count}{" "}
                    {course.count === 1 ? "menu item" : "menu items"}
                  </Text>

                </View>

                <Text style={styles.courseAveragePrice}>
                  R{course.average.toFixed(2)}
                </Text>

              </View>

            ))}

            {/* menu message empty */}

            {totalItems === 0 && (

              <View style={styles.emptyCard}>

                <Text style={styles.emptyTitle}>
                  No menu items available
                </Text>

                <Text style={styles.emptyDescription}>
                  Add menu items to see your restaurant statistics.
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => router.push("/add_menu")}
                >

                  <Text style={styles.addButtonText}>
                    Add First Menu Item
                  </Text>

                </TouchableOpacity>

              </View>

            )}

            {/* menu summary */}

            <View style={styles.summaryCard}>

              <Text style={styles.summaryTitle}>
                Menu Overview
              </Text>

              <View style={styles.summaryRow}>

                <View style={styles.summaryItem}>

                  <Text style={styles.summaryValue}>
                    {totalItems}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Total Dishes
                  </Text>

                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>

                  <Text style={styles.summaryValue}>
                    R{averagePrice.toFixed(2)}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Average Price
                  </Text>

                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>

                  <Text style={styles.summaryValue}>
                    {courseStats.filter(
                      course => course.count > 0
                    ).length}
                  </Text>

                  <Text style={styles.summaryLabel}>
                    Active Courses
                  </Text>

                </View>

              </View>

            </View>

            {/*back to menu button */}

            <TouchableOpacity
              style={styles.backToMenuButton}
              onPress={goBack}
            >

              <Text style={styles.backToMenuText}>
                Back to Menu
              </Text>

            </TouchableOpacity>

            <Text style={styles.footer}>
              Christoffel's Restaurant
            </Text>

          </>

        )}

      </ScrollView>

    </View>

  );

}


// my styles

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
  },

  // header

  header: {
    backgroundColor: "#0F4F4B",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    width: 100,
    height: 65,
    resizeMode: "contain",
    marginBottom: 5,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },

  // Page heading

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    backgroundColor: "#EAF3ED",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  backText: {
    color: "#0F4F4B",
    fontSize: 30,
    lineHeight: 34,
  },

  headingContent: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#0F4F4B",
  },

  pageSubtitle: {
    fontSize: 12,
    color: "#777777",
    marginTop: 3,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777777",
  },

  // Total menu items

  totalCard: {
    backgroundColor: "#0F4F4B",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  totalLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
    marginVertical: 5,
  },

  totalDescription: {
    color: "#D7EAE5",
    fontSize: 12,
  },

  totalIcon: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#286B62",
    alignItems: "center",
    justifyContent: "center",
  },

  totalEmoji: {
    fontSize: 27,
  },

  // Average price

  averageCard: {
    backgroundColor: "#FFF2E3",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F0D8B8",
    marginBottom: 25,
  },

  averageLabel: {
    color: "#555555",
    fontSize: 15,
    fontWeight: "600",
  },

  averageValue: {
    color: "#D97B20",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 7,
  },

  averageDescription: {
    color: "#777777",
    fontSize: 12,
  },

  // Section headings

  sectionHeader: {
    marginBottom: 15,
    marginTop: 5,
  },

  sectionTitle: {
    color: "#0F4F4B",
    fontSize: 19,
    fontWeight: "bold",
  },

  sectionSubtitle: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
  },

  // Course cards

  courseCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  courseTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  courseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  courseIcon: {
    width: 43,
    height: 43,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  courseEmoji: {
    fontSize: 20,
  },

  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },

  courseCount: {
    fontSize: 12,
    color: "#888888",
    marginTop: 3,
  },

  coursePercentage: {
    fontSize: 18,
    fontWeight: "bold",
  },

  progressBackground: {
    height: 9,
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 9,
    borderRadius: 10,
  },

  // Course average prices

  priceCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#B5C865",
  },

  priceCourseName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333333",
  },

  priceItemCount: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  courseAveragePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D97B20",
  },

  // Empty state

  emptyCard: {
    backgroundColor: "#F7F7F7",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
  },

  emptyDescription: {
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
    marginVertical: 10,
  },

  addButton: {
    backgroundColor: "#D97B20",
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Summary

  summaryCard: {
    backgroundColor: "#EAF3ED",
    padding: 18,
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 15,
  },

  summaryTitle: {
    color: "#0F4F4B",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryValue: {
    color: "#0F4F4B",
    fontSize: 17,
    fontWeight: "bold",
  },

  summaryLabel: {
    color: "#666666",
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#B5CDBB",
  },

  // Back button

  backToMenuButton: {
    backgroundColor: "#0F4F4B",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  backToMenuText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    color: "#0F4F4B",
    fontSize: 14,
    marginTop: 20,
    fontWeight: "600",
  },

});
