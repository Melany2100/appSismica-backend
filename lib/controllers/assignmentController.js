import * as utils from "../../utils.js";
import assignmentService from "../service/assignmentService.js";

/**
 * POST /assignments
 * Body: { id_inspector, id_ayudante, id_edificio }
 * Crea una asignación y una notificación al ayudante.
 */
const createAssignment = async (req, res) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/**
 * GET /assignments/helper/:id_ayudante
 * Devuelve todas las asignaciones de un ayudante con datos de edificio.
 * Si no tiene asignaciones devuelve [] (no es error).
 */
const getAssignmentsByHelper = async (req, res) => {
  try {
    const { id_ayudante } = req.params;
    const assignments = await assignmentService.getAssignmentsByHelper(
      id_ayudante
    );
    res.status(200).json(assignments);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/**
 * GET /assignments/inspector/:id_inspector
 * Devuelve todas las asignaciones creadas por un inspector.
 */
const getAssignmentsByInspector = async (req, res) => {
  try {
    const { id_inspector } = req.params;
    const assignments = await assignmentService.getAssignmentsByInspector(
      id_inspector
    );
    res.status(200).json(assignments);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

/**
 * GET /assignments/helper/search?cedula=XXXXXXXXXX
 * Busca un ayudante activo por cédula (para el buscador del inspector).
 */
const findHelperByCedula = async (req, res) => {
  try {
    const { cedula } = req.query;
    if (!cedula) {
      return res.status(400).json({ message: "El parámetro 'cedula' es requerido" });
    }
    const helper = await assignmentService.findHelperByCedula(cedula);
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

const assignmentController = {
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
  findHelperByCedula,
};

export default assignmentController;
