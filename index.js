import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/static-stream/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Falta ID" });
  }

  const m3u8Url = `https://zq62mmaomhqa.cdn-centaurus.com/hls2/01/10767/${id}_n/master.m3u8`;

  res.json({
    sources: [
      {
        file: m3u8Url
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
