import { getParams } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

import { addToCartHandler, productDetails } from "./productDetails.mjs";

// Load header and footer
loadHeaderFooter();

// load product details
productDetails(getParams("product"));

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
