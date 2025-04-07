import { getLocalStorage } from "./utils.mjs";
import { checkout } from "./externalServices.mjs";

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
  // Check if items is an array, if not, make it one
  const itemsArray = Array.isArray(items) ? items : [items];

  // Convert the list of products from localStorage to the simpler form required
  return itemsArray.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // Calculate and display the item subtotal
    // Get the items from localStorage
    const cartItems = getLocalStorage(this.key);

    if (!cartItems) return;

    // Check if cartItems is an array, if not, make it one
    const cartItemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    // Calculate the itemTotal
    this.itemTotal = cartItemsArray.reduce(
      (total, item) => total + item.FinalPrice,
      0
    );

    // Display the itemTotal
    document.querySelector(
      this.outputSelector + " #subtotal"
    ).textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    // Calculate and display shipping, tax, and order total
    // Get the items from localStorage
    const cartItems = getLocalStorage(this.key);

    if (!cartItems) return;

    // Check if cartItems is an array, if not, make it one
    const cartItemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];

    // Calculate shipping ($10 for the first item plus $2 for each additional item)
    const numItems = cartItemsArray.length;
    this.shipping = 10 + (numItems > 1 ? (numItems - 1) * 2 : 0);

    // Calculate tax (6% of the item total)
    this.tax = this.itemTotal * 0.06;

    // Calculate order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // Display the totals
    document.querySelector(
      this.outputSelector + " #shipping"
    ).textContent = `$${this.shipping.toFixed(2)}`;
    document.querySelector(
      this.outputSelector + " #tax"
    ).textContent = `$${this.tax.toFixed(2)}`;
    document.querySelector(
      this.outputSelector + " #orderTotal"
    ).textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    // Build the order data object
    const formData = new FormData(form);
    const orderData = {
      orderDate: new Date().toISOString(),
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2),
    };

    // Add form data to the order data object
    for (const [key, value] of formData.entries()) {
      orderData[key] = value;
    }

    try {
      // Call the checkout method in externalServices module
      const response = await checkout(orderData);
      return response;
    } catch (err) {
      // Pass the error along to be handled by the UI
      throw err;
    }
  }
}
