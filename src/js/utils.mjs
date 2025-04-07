// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export const getParams = (param) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
};

// Function to render a list of items using a template
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Function to render a single template
export function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  position = "afterbegin",
  clear = true,
  callback
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const html = templateFn(data);
  parentElement.insertAdjacentHTML(position, html);
  if (callback) {
    callback(data);
  }
}

// Function to load a template - using currying
export function loadTemplate(path) {
  // Check if we're in production mode (running on Vercel)
  const isProd =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  // If we're in production, adjust the path for our serverless API
  const templatePath =
    isProd && path.includes("/partials/")
      ? `/api/partials?name=${path.split("/partials/")[1].replace(".html", "")}`
      : path;

  return async function () {
    try {
      const res = await fetch(templatePath);
      if (res.ok) {
        const html = await res.text();
        return html;
      } else {
        console.error(
          `Error loading template: ${templatePath} - Status: ${res.status}`
        );
        return `<div class="template-error">Error loading content</div>`;
      }
    } catch (error) {
      console.error(`Error fetching template: ${templatePath}`, error);
      return `<div class="template-error">Error loading content</div>`;
    }
  };
}

// Function to load header and footer
export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");

  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#main-footer");

  const headerHtml = await headerTemplateFn();
  const footerHtml = await footerTemplateFn();

  renderWithTemplate(() => headerHtml, headerEl);
  renderWithTemplate(() => footerHtml, footerEl);
}

// Function to display alert messages
export function alertMessage(message, scroll = true) {
  // Create alert element
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // Use innerHTML to support HTML content in the message
  alert.innerHTML = `<div class="alert-message">${message}</div><span class="close">X</span>`;

  // Style the alert
  alert.style.backgroundColor = "#f8d7da";
  alert.style.borderColor = "#f5c6cb";
  alert.style.color = "#721c24";
  alert.style.padding = "0.75rem 1.25rem";
  alert.style.marginBottom = "1rem";
  alert.style.border = "1px solid transparent";
  alert.style.borderRadius = "0.25rem";
  alert.style.position = "relative";
  alert.style.display = "flex";
  alert.style.justifyContent = "space-between";
  alert.style.alignItems = "flex-start";

  // Style the message part
  const messageDiv = alert.querySelector(".alert-message");
  messageDiv.style.flex = "1";

  // Style the close button
  const closeButton = alert.querySelector(".close");
  closeButton.style.cursor = "pointer";
  closeButton.style.fontWeight = "bold";
  closeButton.style.marginLeft = "10px";

  // Add click event to close button
  closeButton.addEventListener("click", () => {
    alert.remove();
  });

  // Insert at the beginning of main
  const main = document.querySelector("main");
  main.prepend(alert);

  // Scroll to the top if needed
  if (scroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Automatically remove the alert after 7 seconds
  setTimeout(() => {
    alert.remove();
  }, 7000);
}
