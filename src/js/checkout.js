import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";
import { alertMessage } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize the checkout process
const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// Calculate order totals when zip code changes
document.querySelector("#zip").addEventListener("blur", () => {
  // Only calculate if the zip is not empty
  if (document.querySelector("#zip").value) {
    myCheckout.calculateOrderTotal();
  }
});

// Handle form submission
document.querySelector(".checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Check form validity
  const myForm = e.target;
  const formValidity = myForm.checkValidity();
  myForm.reportValidity();

  if (formValidity) {
    // Process the checkout
    myCheckout
      .checkout(myForm)
      .then((response) => {
        // Clear the cart
        localStorage.removeItem("so-cart");

        // Redirect to success page
        location.href = "/checkout/success.html";
      })
      .catch((err) => {
        // Handle errors from the server
        console.error("Error processing order:", err);
        let message =
          "There was a problem processing your order. Please try again.";

        if (err.name === "servicesError") {
          // Check if the error message is an object
          if (typeof err.message === "object") {
            // Create a formatted message from the error object
            message = Object.entries(err.message)
              .map(([field, errorMsg]) => `${errorMsg}`)
              .join("<br>");
          } else {
            message = err.message;
          }
        }

        alertMessage(message);
      });
  }
});
