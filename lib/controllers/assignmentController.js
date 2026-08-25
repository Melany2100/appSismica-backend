import * as utils from "../../utils.js";
import assignmentService from "../service/assignmentService.js";

const getAvailableHelpers = async (req, res) => {
  try {
    const helpers = await assignmentService.getAvailableHelpers();
    res.status(200).json(helpers);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const findHelperByCedula = async (req, res) => {
  try {
    const { cedula } = req.query;
    if (!cedula) {
      return res.status(400).json({ message: "El parámetro 'cedula' es requerido" });
    }

    const helper = await assignmentService.findHelperByCedula(cedula.toString());
    if (!helper) {
      return res
        .status(404)
        .json({ message: "No se encontró un ayudante activo con esa cédula" });
    }

    res.status(200).json(helper);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const createAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getAssignmentsByHelper = async (req, res) => {
  try {
    const assignments = await assignmentService.getAssignmentsByHelper(
      req.params.id_ayudante
    );
    res.status(200).json(assignments);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const getAssignmentsByInspector = async (req, res) => {
  try {
    const assignments = await assignmentService.getAssignmentsByInspector(
      req.params.id_inspector
    );
    res.status(200).json(assignments);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const assignmentController = {
  getAvailableHelpers,
  findHelperByCedula,
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
};

export default assignmentController;
