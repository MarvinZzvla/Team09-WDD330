import { getParams } from "./utils.mjs";

import { addToCartHandler, productDetails } from "./productDetails.mjs";

// load product details
productDetails(getParams("product"));

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
