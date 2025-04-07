import { getOrders } from "./externalServices.mjs";
import { alertMessage } from "./utils.mjs";

// Function to format the date nicely
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default class CurrentOrders {
  constructor(token, listElement) {
    this.token = token;
    this.listElement = listElement;
    this.orders = [];
  }

  async init() {
    try {
      console.log(
        "Fetching orders with token:",
        this.token ? "Token exists" : "No token"
      );

      // Get orders from the server
      this.orders = await getOrders(this.token);
      console.log("Orders received:", this.orders);

      // Display the orders
      this.renderOrders();
      return true;
    } catch (err) {
      console.error("Error in CurrentOrders.init():", err);
      this.handleError(err);
      // Re-throw to allow outer catch to handle it
      throw err;
    }
  }

  handleError(err) {
    console.error("Order loading error:", err);

    // Display error message in the orders list
    if (this.listElement) {
      this.listElement.innerHTML = `
        <div class="order-error">
          <h3>Error Loading Orders</h3>
          <p>${err.message || "Unknown error occurred"}</p>
          <p>Please try again later or contact support.</p>
        </div>
      `;
    }

    // Show alert message to user
    alertMessage("Error loading orders: " + (err.message || "Unknown error"));
  }

  renderOrders() {
    console.log(
      "Rendering orders, count:",
      this.orders ? this.orders.length : 0
    );

    if (!this.orders || this.orders.length === 0) {
      this.listElement.innerHTML = `<p class="no-orders">No orders found.</p>`;
      return;
    }

    try {
      // Sort orders by date (newest first)
      const sortedOrders = [...this.orders].sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      // Create HTML for each order
      const orderHTML = sortedOrders
        .map((order) => {
          // Check if items exists and is an array
          const hasItems = Array.isArray(order.items) && order.items.length > 0;
          const itemsCount = hasItems ? order.items.length : 0;

          // Generate the items HTML safely
          const itemsHtml = hasItems
            ? order.items
                .map((item) => {
                  if (!item) return "<li>Invalid item data</li>";
                  return `
                      <li>
                        ${item.name || "Unknown item"} - $${parseFloat(
                    item.price || 0
                  ).toFixed(2)} x ${item.quantity || 1}
                      </li>
                    `;
                })
                .join("")
            : "<li>No item details available</li>";

          return `
              <div class="order-card">
                <div class="order-header">
                  <h2>Order #${order.id}</h2>
                  <p class="order-date">Ordered on: ${formatDate(
                    order.orderDate
                  )}</p>
                </div>
                <div class="order-details">
                  <p><strong>Items:</strong> ${itemsCount}</p>
                  <p><strong>Ship To:</strong> ${order.fname} ${order.lname}</p>
                  <p><strong>Address:</strong> ${order.street}, ${
            order.city
          }, ${order.state} ${order.zip}</p>
                  <div class="order-totals">
                    <p><strong>Total:</strong> $${parseFloat(
                      order.orderTotal
                    ).toFixed(2)}</p>
                  </div>
                </div>
                <div class="order-items">
                  <h3>Items in Order</h3>
                  <ul>
                    ${itemsHtml}
                  </ul>
                </div>
              </div>
            `;
        })
        .join("");

      // Add to page
      this.listElement.innerHTML = orderHTML;
      console.log("Orders rendered successfully");
    } catch (error) {
      console.error("Error rendering orders:", error);
      this.listElement.innerHTML = `
        <div class="order-error">
          <h3>Error Displaying Orders</h3>
          <p>${error.message || "Unknown error occurred"}</p>
        </div>
      `;
    }
  }
}
