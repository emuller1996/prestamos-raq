import { Router } from "express";
import {
  buscarElasticByType,
  crearElasticByType,
  crearLogsElastic,
  getDocumentById,
} from "../utils/index.js";
import { client } from "../db.js";
import { INDEX_ES_MAIN } from "../config.js";

const PrestamosRouters = Router();

PrestamosRouters.get("/", async (req, res) => {
  try {
    var data = await buscarElasticByType("prestamo");
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamosRouters.get("/getcount", async (req, res) => {
  const result = await client.count({
    index: INDEX_ES_MAIN,
    body: {
      query: {
        term: {
          type: "prestamo", // Consulta keyword para el atributo type igual a "clientes"
        },
      },
    },
  });
  var count = result.body.count;
  return res.status(200).json(++count);
});

PrestamosRouters.get("/:id", async (req, res) => {
  try {
    var data = await getDocumentById(req.params.id);
    if (data.type !== "prestamo") {
      throw new Error("Error al Obtener Prestamo");
    }
    if (data.client.value) {
      data.clientData = await getDocumentById(data.client.value);
    }
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



PrestamosRouters.post("/", async (req, res) => {
  try {
    const data = req.body;
    data.status = "Pendiente";
    const response = await crearElasticByType(data, "prestamo");
    crearLogsElastic(req.headers, req.body, "SE CREO UN PRESTAMO");
    return res.status(201).json({ message: "Usuario Creado.", data, response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default PrestamosRouters;
