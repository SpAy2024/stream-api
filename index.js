import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/api/static-stream/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Falta ID" });

  try {
    // Aquí haces la petición a la API externa que devuelve la URL firmada
    const response = await fetch(`https://player-00.live/api/static-stream/${id}`);

    if (!response.ok) {
      return res.status(500).json({ error: "Error al obtener la URL firmada" });
    }

    const data = await response.json();

    // Validar que la data tenga la estructura esperada
    if (!data.sources || !data.sources[0] || !data.sources[0].file) {
      return res.status(404).json({ error: "Fuente de video no encontrada" });
    }

    // Retornar la URL firmada tal cual
    res.json({
      sources: [
        {
          file: data.sources[0].file
        }
      ]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});



