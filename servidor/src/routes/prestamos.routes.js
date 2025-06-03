import { Router } from "express";
import { buscarElasticByType, crearElasticByType, crearLogsElastic } from "../utils/index.js";

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

PrestamosRouters.post("/", async (req, res) => {
  try {
    const data = req.body;
    data.status ="Pendiente";
    const response = await crearElasticByType(data, "prestamo");
    crearLogsElastic(req.headers, req.body, "SE CREO UN PRESTAMO");
    return res.status(201).json({ message: "Usuario Creado.", data, response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default PrestamosRouters;
