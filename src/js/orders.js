import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import CurrentOrders from "./currentOrders.mjs";

// Load header and footer
loadHeaderFooter();

console.log("Orders page loaded");

// Show debug info if window.showDebugInfo is available
function showDebug(info) {
  console.log(info);
  if (window.showDebugInfo) {
    window.showDebugInfo(info);
  }
}

try {
  // Check if user is logged in - this will redirect to login if not valid
  const token = checkLogin();
  console.log("Token check complete", token ? "Token exists" : "No token");

  if (!token) {
    showDebug("No valid token found. You should be redirected to login page.");
  } else {
    // If we get here, the token is valid
    try {
      const ordersElement = document.querySelector(".orders-list");
      console.log("Orders element found:", ordersElement);

      if (!ordersElement) {
        alertMessage("Could not find orders container element");
        showDebug("Could not find .orders-list element on the page");
      } else {
        const currentOrders = new CurrentOrders(token, ordersElement);
        console.log("Current orders instance created");

        // Use a promise to catch any errors
        currentOrders
          .init()
          .then(() => console.log("Orders initialized successfully"))
          .catch((err) => {
            console.error("Error initializing orders:", err);
            alertMessage(
              "Error loading orders: " + (err.message || "Unknown error")
            );
            showDebug({
              error: "Error loading orders",
              message: err.message || "Unknown error",
              stack: err.stack,
            });
          });
      }
    } catch (err) {
      console.error("Error setting up orders:", err);
      alertMessage(
        "Error setting up orders: " + (err.message || "Unknown error")
      );
      showDebug({
        error: "Error setting up orders",
        message: err.message || "Unknown error",
        stack: err.stack,
      });
    }
  }
} catch (err) {
  console.error("Critical error in orders.js:", err);
  showDebug({
    error: "Critical error in orders page",
    message: err.message || "Unknown error",
    stack: err.stack,
  });
}
