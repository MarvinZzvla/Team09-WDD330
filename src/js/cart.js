import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!cartItems) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty</p>";
    return;
  }

  // Check if cartItems is an array, if not, convert it to an array
  const cartItemsArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  let htmlItems = "";
  let totalPrice = 0;

  // Loop through cart items and generate HTML for each
  cartItemsArray.forEach((item) => {
    htmlItems += cartItemTemplate(item);
    totalPrice += item.FinalPrice;
  });

  document.querySelector(".product-list").innerHTML = htmlItems;

  // Add the cart total and checkout button to the page
  const totalSection = document.createElement("section");
  totalSection.classList.add("cart-total");

  totalSection.innerHTML = `
    <p>Total: $${totalPrice.toFixed(2)}</p>
    <a href="/checkout/index.html" class="checkout-btn">Checkout</a>
  `;

  // Add the total section after the product list
  const productsSection = document.querySelector(".products");
  productsSection.appendChild(totalSection);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
