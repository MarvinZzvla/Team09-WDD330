import productList from "./productList.mjs";
import { loadHeaderFooter, getParams } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Get the category from URL parameter
const category = getParams("category") || "tents";

// Update the page title with the category
document.getElementById(
  "product-category-title"
).textContent = `Top Products: ${
  category.charAt(0).toUpperCase() + category.slice(1)
}`;

// Call the productList function with appropriate selector and category
productList(".product-list", category);
