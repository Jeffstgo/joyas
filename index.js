require("dotenv").config();
const express = require("express");
const app = express();

const logger = require("./middlewares/logger");
const joyasRouter = require("./routes/joyasRouter");

app.use(express.json());
app.use(logger);
app.use("/joyas", joyasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
