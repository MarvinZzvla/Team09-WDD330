// Función serverless para servir como proxy de imágenes
export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400"); // Caché de 24 horas

  // Obtener la URL de la imagen desde los parámetros
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing image URL parameter" });
  }

  try {
    // Decodificar la URL si está codificada
    const decodedUrl = decodeURIComponent(url);

    // Validar que la URL pertenece al dominio del servidor
    if (!decodedUrl.includes("server-nodejs.cit.byui.edu:3000")) {
      return res
        .status(403)
        .json({ error: "Only URLs from the course server are allowed" });
    }

    // Realizar la solicitud para obtener la imagen
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch image: ${response.statusText}`,
      });
    }

    // Obtener el tipo de contenido y los bytes de la imagen
    const contentType = response.headers.get("content-type");
    const imageBuffer = await response.arrayBuffer();

    // Establecer las cabeceras de la respuesta
    res.setHeader("Content-Type", contentType || "image/jpeg");

    // Enviar la imagen como respuesta
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Error proxying image:", error);
    res.status(500).json({
      error: "Error proxying image",
      message: error.message,
    });
  }
}
