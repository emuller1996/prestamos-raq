import { Router } from "express";
import { client } from "../db.js";

import UsuariosRouters from "./usuarios.routes.js";
import AuthRouters from "./auth.routes.js";
import { validateTokenMid } from "../utils/authjws.js";
import { INDEX_ES_MAIN_LOGS } from "../config.js";
import PagosRouters from "./pagos.routes.js";
import ClienteRouters from "./clientes.routes.js";
import PrestamosRouters from "./prestamos.routes.js";

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/usuarios", validateTokenMid, UsuariosRouters);
router.use("/auth", AuthRouters);
router.use("/pagos", PagosRouters);
router.use("/clientes", ClienteRouters);
router.use("/prestamos", PrestamosRouters);



router.get("/test", async (req, res) => {
  try {
    /* const searchResult = await client.get({index:"test"}) */

    return res.json({ message: "ss", client /* searchResult */ });
  } catch (error) {
    return res.json({ message: "ss", error: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const searchResult = client;
    console.log(client);
    return res.json(client);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN_LOGS,
      size: 100,
      body: {
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });
    return res.json(searchResult.body.hits.hits);
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message });
  }
});
export default router;
