import { findProductById } from "./externalServices.mjs";
import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";
export const productDetails = async (productId) => {
  await renderProductDetails(productId);
};

// add to cart button event handler
export async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
  alertMessage(`${product.Name} added to cart!`, false);
}

function addProductToCart(product) {
  // Get existing cart items or initialize empty array
  let cart = getLocalStorage("so-cart");

  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  // Add the new product
  cart.push(product);

  // Save the updated cart
  setLocalStorage("so-cart", cart);
}

/************************************************************************
 * Load product details
 * Get product id from URL and load product details from JSON
 * replace the content of the product page with the product details
 *********************************************************************/
export const renderProductDetails = async (productId) => {
  const product = await findProductById(productId);
  document.getElementById("productBrand").textContent = product.Brand.Name;
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productImage").src = product.Images.PrimaryLarge;
  document.getElementById("productImage").alt = product.Name;
  document.getElementById(
    "productPrice"
  ).textContent = `$${product.FinalPrice}`;
  document.getElementById("productColor").textContent =
    product.Colors[0].ColorName;
  document.getElementById("productDescription").innerHTML =
    product.DescriptionHtmlSimple;
  document.getElementById("addToCart").dataset.id = productId;
};
