const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const TOC = require("./toc");

const { getTOCFilePath, getDataDir } = require("./config");

const app = express();
const toc = TOC.loadFrom(getTOCFilePath());

app.use(cors());

app.use(express.raw({ limit: "50mb", type: "application/json" }));
app.use(express.raw({ limit: "50mb", type: "application/zip" }));
app.use(express.raw({ limit: "50mb", type: "application/gzip" }));
app.use(express.raw({ limit: "50mb", type: "application/octet-stream" }));
app.use(express.raw({ limit: "50mb", type: "application/xml" }));
app.use(express.raw({ limit: "50mb", type: "text/*" }));
app.use(express.raw({ limit: "50mb", type: "image/*" }));

app.get("/keys", async (req, res) => {
  const keys = await toc.keys();
  res.send(Array.from(keys));
});

app.get("/entries/:key", async (req, res) => {
  const key = req.params.key;
  const metaData = await toc.get(key);

  if (!metaData) {
    res.sendStatus(404);
  } else {
    const dataDir = getDataDir();
    res.sendFile(path.resolve(dataDir, key), {
      headers: {
        "Content-Type": metaData.type,
      },
    });
  }
});

app.put("/entries/:key", async (req, res) => {
  const key = req.params.key;
  const type = req.headers["content-type"];
  const value = req.body;

  const valueLocation = path.resolve(getDataDir(), key);
  await toc.set(key, { type: type, valueLocation: valueLocation });

  fs.writeFile(valueLocation, value, (err) => {
    if (err) {
      res.status(500).send({ message: "Error! " + err.toString() });
    } else {
      res.sendStatus(204);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Now running kvlocal on port " + port);
});
