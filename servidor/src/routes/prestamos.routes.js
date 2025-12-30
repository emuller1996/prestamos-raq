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

PrestamosRouters.get("/:id/pago_abono", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "pago_abono_prestamo",
                  },
                },
              },
              {
                term: {
                  "prestamo_id.keyword": {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          suma_pagos: {
            sum: {
              field: "amount",
            },
          },
        },
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });

    const dataFuncion = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });
    return res
      .status(200)
      .json({
        data: dataFuncion,
        suma_pagos: searchResult.body.aggregations.suma_pagos,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamosRouters.get("/:id/pago_interes", async (req, res) => {
  try {
    const searchResult = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  "type.keyword": {
                    value: "pago_interes_prestamo",
                  },
                },
              },
              {
                term: {
                  "prestamo_id.keyword": {
                    value: req.params.id,
                  },
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    });

    const dataFuncion = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });
    return res.status(200).json(dataFuncion);
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

PrestamosRouters.post("/:id/pago_abono", async (req, res) => {
  try {
    const data = req.body;
    data.prestamo_id = req.params.id;
    const response = await crearElasticByType(data, "pago_abono_prestamo");
    crearLogsElastic(req.headers, req.body, "SE CREO UN PAGO ABONO");
    return res
      .status(201)
      .json({ message: "Pago de abono creado correctamente " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

PrestamosRouters.post("/:id/pago_interes", async (req, res) => {
  try {
    data.prestamo_id = req.params.id;
    const data = req.body;
    const response = await crearElasticByType(data, "pago_interes_prestamo");
    crearLogsElastic(req.headers, req.body, "SE CREO UN PAGO INTERES");
    return res.status(201).json({ message: "Usuario Creado.", data, response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default PrestamosRouters;
