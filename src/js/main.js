import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Call the productList function with appropriate selector and category
productList(".product-list", "tents");
