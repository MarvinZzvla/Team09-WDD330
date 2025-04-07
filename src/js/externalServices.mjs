const baseURL = import.meta.env.VITE_SERVER_URL;

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
  const loginURL = "http://server-nodejs.cit.byui.edu:3000/login";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  };

  const response = await fetch(loginURL, options);
  const data = await convertToJson(response);
  return data.accessToken;
}

export async function getOrders(token) {
  const ordersURL = "http://server-nodejs.cit.byui.edu:3000/orders";

  console.log("Getting orders from:", ordersURL);
  console.log("Token available:", token ? "Yes" : "No");

  if (!token) {
    throw new Error("No authentication token provided");
  }

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log("Sending request to orders API");
    const response = await fetch(ordersURL, options);
    console.log("Response received:", response.status, response.statusText);

    const data = await convertToJson(response);
    console.log(
      "Orders data received, count:",
      Array.isArray(data) ? data.length : "N/A"
    );
    return data;
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error;
  }
}
