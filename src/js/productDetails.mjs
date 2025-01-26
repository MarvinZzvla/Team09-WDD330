import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";
export const productDetails = async (productId) => {
  await renderProductDetails(productId);
};

// add to cart button event handler
export async function addToCartHandler(e) {
  const product = await findProductById(e.target.dataset.id);
  addProductToCart(product);
}

function addProductToCart(product) {
  setLocalStorage("so-cart", product);
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
  document.getElementById("productImage").src = product.Image;
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
