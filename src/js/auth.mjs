import { loginRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
  try {
    console.log("Login attempt with:", creds.email);
    const token = await loginRequest(creds);
    console.log("Login successful, token received");
    setLocalStorage(tokenKey, token);
    // because of the default arg provided above...if no redirect is provided send them Home.
    console.log("Redirecting to:", redirect);
    window.location = redirect;
  } catch (err) {
    console.error("Login error:", err);
    alertMessage(err.message.message || err.message);
  }
}

export function isTokenValid(token) {
  console.log("Checking token validity");

  // Check if token exists
  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    // Decode the token
    console.log("Decoding token");
    const decoded = jwtDecode(token);
    console.log("Token decoded:", decoded);

    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Current time (seconds):", currentTime);
    console.log("Token expiration:", decoded.exp);

    // Check if token is expired
    if (decoded.exp < currentTime) {
      console.log(
        "Token expired at:",
        new Date(decoded.exp * 1000).toLocaleString()
      );
      return false;
    } else {
      console.log(
        "Token is valid until:",
        new Date(decoded.exp * 1000).toLocaleString()
      );
      return true;
    }
  } catch (error) {
    // If there's an error decoding the token, it's invalid
    console.error("Error validating token:", error);
    return false;
  }
}

export function checkLogin() {
  console.log("Checking login status");

  // Get token from localStorage
  const token = getLocalStorage(tokenKey);
  console.log("Token from localStorage:", token ? "Found" : "Not found");

  // Check if token is valid
  const valid = isTokenValid(token);
  console.log("Token validation result:", valid ? "Valid" : "Invalid");

  if (!valid) {
    // Token is invalid or doesn't exist, remove it from localStorage
    console.log("Removing invalid token from localStorage");
    localStorage.removeItem(tokenKey);

    // Get current path for redirect
    const path = window.location.pathname;
    console.log("Current path:", path);

    // Redirect to login with current path as redirect parameter
    const loginUrl = `/login/index.html?redirect=${path}`;
    console.log("Redirecting to:", loginUrl);
    window.location = loginUrl;
    return null;
  }

  // Token is valid, return it
  console.log("Valid token found, returning it");
  return token;
}
