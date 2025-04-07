// Función serverless de Vercel que sirve como proxy para las solicitudes API
export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Responder a las verificaciones preflight de CORS
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Obtener el endpoint de la API desde la URL de la solicitud (aceptamos tanto 'target' como 'endpoint')
  const targetPath = req.query.target || req.query.endpoint;

  if (!targetPath) {
    return res
      .status(400)
      .json({ error: "Missing target or endpoint parameter" });
  }

  // URL base de la API
  const baseURL = "http://server-nodejs.cit.byui.edu:3000/";
  const apiURL = `${baseURL}${targetPath}`;

  try {
    // Preparar las cabeceras de la solicitud
    const headers = {};

    // Copiar algunas cabeceras relevantes de la solicitud original
    const relevantHeaders = ["content-type", "authorization"];
    relevantHeaders.forEach((header) => {
      if (req.headers[header]) {
        headers[header] = req.headers[header];
      }
    });

    // Preparar las opciones para fetch
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Manejar el cuerpo de la solicitud para métodos POST, PUT, etc.
    if (req.body && ["POST", "PUT", "PATCH"].includes(req.method)) {
      // Si el content-type es application/json, convertir el cuerpo a JSON
      if (headers["content-type"]?.includes("application/json")) {
        fetchOptions.body = JSON.stringify(req.body);
      } else {
        fetchOptions.body = req.body;
      }
    }

    // Realizar la solicitud a la API original
    const response = await fetch(apiURL, fetchOptions);

    // Obtener la respuesta como JSON
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
      // Enviar la respuesta como JSON
      res.status(response.status).json(data);
    } else {
      // Para respuestas no JSON, devolver como texto
      data = await response.text();
      res.status(response.status).send(data);
    }
  } catch (error) {
    console.error("Error en el proxy:", error);
    res.status(500).json({
      error: "Error proxying request to API",
      message: error.message,
    });
  }
}
