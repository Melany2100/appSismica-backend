import * as utils from "../../utils.js";
import buildingService from "../service/buildingService.js";

const getBuildings = async (req, res) => {
  try {
    const buildings = await buildingService.getBuildings();
    res.status(200).json(buildings);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const createBuilding = async (req, res) => {
  try {
    const newBuilding = await buildingService.createBuilding(
      { ...req.body },
      {
        foto_edificio: req.files["foto_edificio"]?.[0],
        grafico_edificio: req.files["grafico_edificio"]?.[0],
      }
    );
    res.status(201).json(newBuilding);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const updateBuilding = async (req, res) => {
  try {
    const updatedBuilding = await buildingService.updateBuilding(
      req.params.id,
      { ...req.body },
      {
        foto_edificio: req.files["foto_edificio"]?.[0],
        grafico_edificio: req.files["grafico_edificio"]?.[0],
      }
    );
    res.status(201).json(updatedBuilding);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const deleteBuilding = async (req, res) => {
  try {
    const result = await buildingService.deleteBuilding(req.params.id);
    if (result) {
      res.status(200).json({
        message: "Edificio eliminado exitosamente",
        deleted: true,
      });
    } else {
      res.status(404).json({
        message: "Edificio no encontrado",
        deleted: false,
      });
    }
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const buildingController = {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};

export default buildingController;
