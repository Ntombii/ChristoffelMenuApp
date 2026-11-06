import React, { useState } from "react";
import {
  Alert, 
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

//import AsyncStorage for storing user data
import AsyncStorage from "@react-native-async-storage/async-storage";

// import router for navigation
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const [errors, setErrors] = useState({});

  // validate form function
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert( 
        "Could not log in", 
        "Please enter your email and password."
      ); 
      return;
    }

    try { 
      // retrieve the saved user data from AsyncStorage 
      const savedUser = await AsyncStorage.getItem("user");
      // retrieve the saved user data from AsyncStorage
      if (!savedUser) { 
        Alert.alert( 
          "Account not found", 
          "Register an account before logging in.", 
          [ 
            { 
              text: "Sign Up", 
              onPress: () => router.push("/signup"), 
            }, 
            { 
              text: "Cancel", 
              style: "cancel", 
            }, 
          ] 
        );
        return; 
      }
      // parse the saved user data from JSON string to object
      const user = JSON.parse(savedUser); 
      // =email and password validation
      const emailMatches = email.trim().toLowerCase() === user.email.toLowerCase();
      const passwordMatches = password === user.password;

      if (emailMatches && passwordMatches) { 
        // login successful, store login state in AsyncStorage 
        await AsyncStorage.setItem("isLoggedIn", "true"); 
        Alert.alert( 
          "You are logged in!", 
          `Welcome back, ${user.fullName}!`, 
          [ 
            { 
              text: "OK", 
              onPress: () => router.replace("/home"), 
            },
          ] 
        );
      } else {
        Alert.alert( 
          "Incorrect email or password. Enter the details you registered with." 
        );
      } 
    } catch (error) { 
      console.log("Login error:", error);
      Alert.alert( 
        "Error",
        "Something went wrong while trying to log in." 
      );
    } 
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
         
                {/* logo and title */}
                <Image source={require('../../assets/images/logo.png')}
                style={styles.logo} />
        
        <Text style={styles.headerTitle}>Christoffel's Restaurant</Text>
        <Text style={styles.subtitle}>Welcome Back</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* email validation error */}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* password validation error */}
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
          <Text style={styles.primaryBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  header: {
    backgroundColor: "#0F5246",
    paddingVertical: 50,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  logo: {
    color: "#fff",
    width:60,
    height:60,
    marginRight:30,
    backgroundColor:"#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
   headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "InstrumentSerif",
  },
  subtitle: {
    color: "#FFF",
    marginTop: 8,
    fontSize: 16,
  },
  form: {
    padding: 25,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 55,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  primaryBtn: {
    backgroundColor: "#556B13",
    borderRadius: 25,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#0F5246",
    fontWeight: "600",
  },
});
