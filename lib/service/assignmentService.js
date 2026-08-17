import * as utils from "../../utils.js";
import { AssignmentSchema } from "../schema/assignmentSchema.js";
import assignmentRepository from "../repositories/assignmentRepository.js";
import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";
import AnomalyCode from "../../anomaly.js";

/**
 * Crea una asignación inspector → ayudante → edificio.
 * Valida que:
 *  - El ayudante exista y tenga rol 'ayudante'
 *  - El inspector exista y tenga rol 'inspector'
 *  - El edificio exista
 */
const createAssignment = async (body) => {
  // Convertir strings a números si vienen del form-data
  const parsed = AssignmentSchema.parse({
    id_inspector: Number(body.id_inspector),
    id_ayudante: Number(body.id_ayudante),
    id_edificio: Number(body.id_edificio),
  });

  // Verificar inspector
  const inspector = await db(DatabaseTable.usuarios)
    .select("id_usuario", "rol")
    .where({ id_usuario: parsed.id_inspector, activo: true })
    .first();

  if (!inspector) {
    throw new utils.CustomError(
      AnomalyCode.userDoesNotExist,
      "El inspector no existe o no está activo"
    );
  }
  if (inspector.rol !== "inspector") {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "El usuario indicado como inspector no tiene rol de inspector"
    );
  }

  // Verificar ayudante
  const ayudante = await db(DatabaseTable.usuarios)
    .select("id_usuario", "rol")
    .where({ id_usuario: parsed.id_ayudante, activo: true })
    .first();

  if (!ayudante) {
    throw new utils.CustomError(
      AnomalyCode.userDoesNotExist,
      "El ayudante no existe o no está activo"
    );
  }
  if (ayudante.rol !== "ayudante") {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "El usuario indicado como ayudante no tiene rol de ayudante"
    );
  }

  // Verificar edificio
  const edificio = await db(DatabaseTable.edificios)
    .select("id_edificio")
    .where({ id_edificio: parsed.id_edificio })
    .first();

  if (!edificio) {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "El edificio indicado no existe"
    );
  }

  return await assignmentRepository.createAssignment(parsed);
};

/**
 * Consulta las asignaciones de un ayudante (para su Home).
 * Devuelve array vacío si no tiene asignaciones.
 */
const getAssignmentsByHelper = async (id_ayudante) => {
  const assignments = await assignmentRepository.getAssignmentsByHelper(
    Number(id_ayudante)
  );
  return assignments;
};

/**
 * Consulta las asignaciones creadas por un inspector.
 */
const getAssignmentsByInspector = async (id_inspector) => {
  return await assignmentRepository.getAssignmentsByInspector(
    Number(id_inspector)
  );
};

/**
 * Busca un ayudante activo por cédula.
 * Retorna null si no se encuentra.
 */
const findHelperByCedula = async (cedula) => {
  return await assignmentRepository.findHelperByCedula(cedula);
};

const assignmentService = {
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
  findHelperByCedula,
};

export default assignmentService;
