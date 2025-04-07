import { loadHeaderFooter, getParams } from "./utils.mjs";
import { login } from "./auth.mjs";

// Load header and footer
loadHeaderFooter();

// Check for redirect parameter
const redirect = getParams("redirect") || "/";

// Add event listener to form
document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Login with credentials
  login({ email, password }, redirect);
});
