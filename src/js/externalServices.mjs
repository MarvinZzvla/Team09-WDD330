// Get the base URL from environment variables
let baseURL = import.meta.env.VITE_SERVER_URL;

// No need to add trailing slash with our proxy configuration
// We'll add a small debug message to verify the URL being used
console.log("API baseURL:", baseURL);

// Function to fix image URLs to use our proxy in production
function fixImageUrls(data) {
  // Check if we're in production (running on HTTPS)
  const isProd = window.location.protocol === "https:";

  if (!isProd) return data; // No need to fix URLs in development

  // Helper function to process a single URL
  const fixUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("http://server-nodejs.cit.byui.edu:3000")) return url;

    // Encode the URL and use our image proxy
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  // Process different data structures
  if (Array.isArray(data)) {
    // If data is an array, map through it
    return data.map((item) => fixImageUrls(item));
  } else if (data && typeof data === "object") {
    // Process object properties
    const result = { ...data };

    // Handle Images object with nested properties
    if (data.Images) {
      result.Images = { ...data.Images };

      // Fix primary image URLs
      [
        "PrimarySmall",
        "PrimaryMedium",
        "PrimaryLarge",
        "PrimaryExtraLarge",
      ].forEach((key) => {
        if (data.Images[key]) {
          result.Images[key] = fixUrl(data.Images[key]);
        }
      });

      // Fix extra images array
      if (Array.isArray(data.Images.ExtraImages)) {
        result.Images.ExtraImages = data.Images.ExtraImages.map((img) => ({
          ...img,
          Src: fixUrl(img.Src),
        }));
      }
    }

    // Handle Colors array with image URLs
    if (Array.isArray(data.Colors)) {
      result.Colors = data.Colors.map((color) => ({
        ...color,
        ColorChipImageSrc: fixUrl(color.ColorChipImageSrc),
        ColorPreviewImageSrc: fixUrl(color.ColorPreviewImageSrc),
      }));
    }

    // Handle Brand with LogoSrc
    if (data.Brand && data.Brand.LogoSrc) {
      result.Brand = {
        ...data.Brand,
        LogoSrc: fixUrl(data.Brand.LogoSrc),
      };
    }

    return result;
  }

  return data;
}

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export async function getProductsByCategory(category = "tents") {
  const response = await fetch(baseURL + `products/search/${category}`);
  const data = await convertToJson(response);
  // Process image URLs before returning
  return fixImageUrls(data.Result);
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const data = await convertToJson(response);
  // Process image URLs before returning
  return fixImageUrls(data.Result);
}

export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(baseURL + "checkout", options);
  const data = await convertToJson(response);
  return data;
}

export async function loginRequest(creds) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  };

  const response = await fetch(baseURL + "login", options);
  const data = await convertToJson(response);
  return data.accessToken;
}

export async function getOrders(token) {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(baseURL + "orders", options);
  const data = await convertToJson(response);
  // Process any image URLs in orders
  return fixImageUrls(data);
}
