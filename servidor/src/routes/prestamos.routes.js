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

PrestamosRouters.get("/pagination", async (req, res) => {
  let perPage = req.query.perPage ?? 10;
  let page = req.query.page ?? 1;
  let search = req.query.search ?? "";
  let num_day_payment = req.query.num_day_payment ?? "";
  let category = req.query.category ?? "";
  let published = req.query.published ?? "";

  try {
    var consulta = {
      index: INDEX_ES_MAIN,
      size: perPage,
      from: (page - 1) * perPage,
      body: {
        query: {
          bool: {
            must: [
              /* { match_phrase_prefix: { name: nameQuery } } */
            ],
            filter: [
              {
                term: {
                  type: "prestamo",
                },
              },
            ],
          },
        },
        sort: [
          { "createdTime": { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    };
    if (num_day_payment !== "" && num_day_payment) {
      consulta.body.query.bool.filter.push({
        term: {
          "num_day_payment.keyword": num_day_payment,
        },
      });
    }
    if (category !== "" && category) {
      consulta.body.query.bool.filter.push({
        term: {
          "category_id.keyword": category,
        },
      });
    }
    if (published !== "" && published) {
      consulta.body.query.bool.filter.push({
        term: {
          "published": published,
        },
      });
    }
    if (search !== "" && search) {
      consulta.body.query.bool.must.push({
        query_string: { query: `*${search}*`, fields: ["client.label", "code"] },
      });
    }
    const searchResult = await client.search(consulta);

    var data = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
      };
    });

    data = data.map(async (product) => {
      return {
        ...product,
        categoria: product.category_id
          ? await getDocumentById(product?.category_id)
          : "",
      };
    });
    data = await Promise.all(data);
    /* return {
      data: data,
      total: searchResult.body.hits.total.value,
      total_pages: Math.ceil(searchResult.body.hits.total.value / perPage),
    }; */

    return res.status(200).json({
      data: data,
      total: searchResult.body.hits.total.value,
      total_pages: Math.ceil(searchResult.body.hits.total.value / perPage),
    });
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

    const dataLog = {};
    const data = req.body;
    data.prestamo_id = req.params.id;
    
    dataLog.data = data
    //validar pago de interes

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
              {
                term: {
                  "mes_pago.keyword": {
                    value: data.mes_pago,
                  },
                },
              },
              {
                term: {
                  "year_pago": {
                    value: data.year_pago,
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

    if(dataFuncion.length > 0){
      return res.status(400).json({ message: `El pago de interes en el mes de ${data.mes_pago} ya ha sido registrado.`, dataFuncion });
    }


    const response = await crearElasticByType(data, "pago_interes_prestamo");
    dataLog.response_es = response
    crearLogsElastic(req.headers, dataLog, "SE CREO UN PAGO INTERES");
    return res.status(201).json({ message: "Pago de Interes Creado." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default PrestamosRouters;
