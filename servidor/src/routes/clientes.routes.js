import { Router } from "express";
import xlsx from "xlsx";
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
import pkg from "express-fileupload";
import { client } from "../db.js";
import {
  buscarElasticByType,
  crearElasticByType,
  crearLogsElastic,
  getDocumentById,
  updateElasticByType,
} from "../utils/index.js";
import md5 from "md5";
import {
  generateClienteAccessToken,
  validateTokenClient,
  validateTokenClientMid,
  validateTokenMid,
} from "../utils/authjws.js";
import { INDEX_ES_MAIN } from "../config.js";
import { jwtDecode } from "jwt-decode";
import { sendVerificationEmail } from "../services/mailService.js";
const fileUpload = pkg;
const ClienteRouters = Router();

ClienteRouters.get("/", validateTokenMid, async (req, res) => {
  try {
    var clientes = await buscarElasticByType("cliente");
    clientes = clientes.map(async (c) => {
      if (c.ruta_id && c.ruta_id !== "") {
        try {
          const re = await getDocumentById(c.ruta_id);
          return {
            ...c,
            ruta_view: { ...re.body._source, _id: re.body._id },
          };
        } catch (error) {
          return c;
        }
      } else {
        return c;
      }
    });
    clientes = await Promise.all(clientes);
    /* return res.json(searchResult.body.hits); */
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.post("/", validateTokenMid, async (req, res) => {
  try {
    var customer = {};
    const data = req.body;
    //validacion usuario.

    data.createdTime = new Date().getTime();
    const response = await crearElasticByType(data, "cliente");
    customer = response.body;
    return res.status(200).json({
      message: "Cliente Creado.",
      customer,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.put("/:id", validateTokenMid, async (req, res) => {
  try {
    const r = await updateElasticByType(req.params.id, req.body);
    if (r.body.result === "updated") {
      await client.indices.refresh({ index: INDEX_ES_MAIN });
      return res.json({ message: "Cliente Actualizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
ClienteRouters.get("/validate", validateTokenClient);

ClienteRouters.post("/login", async (req, res) => {
  try {
    const data = req.body;
    //validacion usuario.
    const requestEL = await client.search({
      index: INDEX_ES_MAIN,
      size: 1000,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  type: {
                    value: "cliente",
                  },
                },
              },
              {
                term: {
                  "email_client.keyword": {
                    value: data.email_client,
                  },
                },
              },
            ],
          },
        },
      },
    });

    if (requestEL.body.hits.total.value > 0) {
      let dataUser = requestEL.body.hits.hits[0]?._source;
      dataUser._id = requestEL.body.hits.hits[0]?._id;
      if (md5(data.password_client) === dataUser.hash) {
        delete dataUser.hash;
        let token = generateClienteAccessToken(dataUser);
        return res.status(200).json({
          ...requestEL,
          message: "Usuario ya esta Registrado.",
          detail: `ya hay un usuario con el correo electronico '${data.email_client}' en la base de datos como cliente.`,
          dataUser,
          token,
        });
      } else {
        return res.status(404).json({
          error: true,
          message: "Contraseña Incorrecta.",
          detail: `La contraseña que esta ingresando es incorrecta, si no te acuerdas de ella, dale en recuperar contraseña.'`,
        });
      }
    } else {
      return res.status(404).json({
        error: true,
        message: "Usuario no registrado.",
        detail: `No hay usuario con el correo electronico '${data.email_client} en la base de datos como cliente.'`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.post(
  "/new/address",
  validateTokenClientMid,
  async (req, res) => {
    try {
      const decoded = jwtDecode(req.headers.authorization);
      var dataAddress = req.body;
      dataAddress.client_id = decoded._id;
      const response = await crearElasticByType(
        dataAddress,
        "direccion_cliente"
      );
      return res
        .status(200)
        .json({ melo: dataAddress, body: req.body, decoded, response });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

ClienteRouters.put(
  "/new/address/:idAddress",
  validateTokenClientMid,
  async (req, res) => {
    try {
      const r = await updateElasticByType(req.params.idAddress, req.body);
      if (r.body.result === "updated") {
        await client.indices.refresh({ index: INDEX_ES_MAIN });
        return res.json({ message: "Actualizado" });
      }
      /* return res
        .status(200)
        .json({ message: "test", req: req.params.idAddress }); */
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

ClienteRouters.get("/pagination", validateTokenMid, async (req, res) => {
  let perPage = req.query.perPage ?? 10;
  let page = req.query.page ?? 1;
  let search = req.query.search ?? "";

  try {
    var consulta = {
      index: INDEX_ES_MAIN,
      size: perPage,
      from: (page - 1) * perPage,
      body: {
        query: {
          bool: {
            must: [],
            filter: [
              {
                term: {
                  type: "cliente",
                },
              },
            ],
          },
        },
        sort: [
          { createdTime: { order: "desc" } }, // Reemplaza con el campo por el que quieres ordenar
        ],
      },
    };
    if (search !== "" && search) {
      consulta.body.query.bool.must.push({
        query_string: {
          query: `*${search}*`,
          fields: ["name", "telefono", "alias"],
        },
      });
    }
    const searchResult = await client.search(consulta);
    var data = searchResult.body.hits.hits.map((c) => {
      return {
        ...c._source,
        _id: c._id,
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
      consulta,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

ClienteRouters.post("/:id/comments", validateTokenMid, async (req, res) => {
  const dataComentarioCliente = req.body;
  const resElasCreate = await crearElasticByType(
    dataComentarioCliente,
    "comentario"
  );
  return res.status(200).json({
    message: "Se creo el comentario correctamente. ",
    resElasCreate,
  });
});

ClienteRouters.get("/:id/comments", async (req, res) => {
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
                    value: "comentario",
                  },
                },
              },
              {
                term: {
                  "clien_id.keyword": {
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

export default ClienteRouters;
