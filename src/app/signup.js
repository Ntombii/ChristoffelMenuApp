import React, { useState } from "react";

import {
  View,
  Text,
  Alert,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import { useFonts } from 'expo-font';
import {
  InstrumentSerif_400Regular,
} from '@expo-google-fonts/instrument-serif';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Signup() {
    const [fontsLoaded] = useFonts({
      InstrumentSerif: InstrumentSerif_400Regular,
    });
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(phone)) {
      newErrors.phone =
        "Phone number must contain 10-15 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
const handleRegister = async () => { 
  if (!validateForm()) { Alert.alert( "Validation failed",
     "Please correct the errors in the form." 
    );
    
     return;
    
  } try { 
    // check if an account already exists 
    const existingUser = await AsyncStorage.getItem("user");
    
    if (existingUser) 
      { const user = JSON.parse(existingUser); 
        if (user.email.toLowerCase() === email.trim().toLowerCase())
           { Alert.alert
            ( "Account already exists", "An account with this email address already exists. Please login."

             );
              return; 
            } 
          }
           // create the new user account
            const user =
             { fullName: fullName.trim(),
               email: email.trim().toLowerCase(), 
               phone: phone.trim(), 
               password: password, }; 
               // Save registration details 
               await AsyncStorage.setItem
               ("user", JSON.stringify(user));
                Alert.alert( "Registration successful", 
                  "Your account has been created. Please login using the email and password you registered with.",
                   [ { text: "OK", onPress: () =>
                     router.replace("/login"), }, ] );
                     } catch (error) {
                       console.log("Error saving user:", error);
                        Alert.alert( "Error", "Something went wrong while creating your account." );

                      } };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          {/* logo and title */}
                  <Image source={require('../../assets/images/logo.png')}
                  style={styles.logo} />
          
          <Text style={styles.headerTitle}>
            Christoffel's Restaurant
          </Text>

          <Text style={styles.subtitle}>
            Create Account
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          {errors.fullName && (
            <Text style={styles.error}>
              {errors.fullName}
            </Text>
          )}

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {errors.email && (
            <Text style={styles.error}>
              {errors.email}
            </Text>
          )}

          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          {errors.phone && (
            <Text style={styles.error}>
              {errors.phone}
            </Text>
          )}

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {errors.password && (
            <Text style={styles.error}>
              {errors.password}
            </Text>
          )}

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {errors.confirmPassword && (
            <Text style={styles.error}>
              {errors.confirmPassword}
            </Text>
          )}

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
          >
            <Text style={styles.registerBtnText}>
              Register
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
          >
            <Text style={styles.link}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
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
    color: "#fff",
    marginTop: 10,
  },

  form: {
    padding: 25,
  },

  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    height: 55,
    paddingHorizontal: 20,
    marginBottom: 5,
  },

  error: {
    color: "#D32F2F",
    marginLeft: 10,
    marginBottom: 10,
  },

  registerBtn: {
    backgroundColor: "#E58425",
    borderRadius: 25,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  registerBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    color: "#0F5246",
    marginTop: 20,
    fontWeight: "600",
  },
});