// Get the base URL from environment variables
let baseURL = import.meta.env.VITE_SERVER_URL;

// No need to add trailing slash with our proxy configuration
// We'll add a small debug message to verify the URL being used
console.log("API baseURL:", baseURL);

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
  return data.Result;
}

export async function findProductById(id) {
  const response = await fetch(baseURL + `product/${id}`);
  const data = await convertToJson(response);
  return data.Result;
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
  return data;
}
