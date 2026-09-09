import { Redirect } from "expo-router";

export default function Index() {
  // This safely pushes the user to the login screen cleanly on startup
  return <Redirect href="/signup" />;
}
