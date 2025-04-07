import { getProductsByCategory } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// Function to filter to only 4 products
function filterProducts(products) {
  // Filter to first 4 products
  return products.filter((item, index) => index < 4);
}

export default async function productList(selector, category) {
  // get the element we will insert the list into from the selector
  const el = document.querySelector(selector);
  // get the list of products
  const products = await getProductsByCategory(category);
  // filter to only show needed products
  const filteredProducts = filterProducts(products);
  // render out the product list to the element using the template function
  renderListWithTemplate(productCardTemplate, el, filteredProducts);
}
