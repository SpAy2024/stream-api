import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import cheerio from "cheerio";

const app = express();
app.use(cors());

app.get("/api/static-stream/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Falta ID" });

  try {
    const url = `https://player-00.live/stream/${id}`;
    const htmlRes = await fetch(url);
    const html = await htmlRes.text();

    const $ = cheerio.load(html);
    const scripts = $("script");
    let m3u8Url = null;

    scripts.each((i, el) => {
      const scriptContent = $(el).html();
      if (scriptContent && scriptContent.includes(".m3u8")) {
        const match = scriptContent.match(/https:\/\/[^\s"']+\.m3u8[^\s"']*/);
        if (match) {
          m3u8Url = match[0];
          return false; // break loop
        }
      }
    });

    if (!m3u8Url) return res.status(404).json({ error: "No se encontró la URL .m3u8" });

    res.json({ sources: [{ file: m3u8Url }] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al obtener video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
