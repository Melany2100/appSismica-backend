import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";
import assignmentRepository from "../repositories/assignmentRepository.js";
import { AssignmentSchema } from "../schema/assignmentSchema.js";

const getAvailableHelpers = async () => {
  return await assignmentRepository.getAvailableHelpers();
};

const findHelperByCedula = async (cedula) => {
  return await assignmentRepository.findHelperByCedula(cedula.trim());
};

const createAssignment = async (body) => {
  const parsed = AssignmentSchema.parse({
    id_inspector: Number(body.id_inspector),
    id_ayudante: Number(body.id_ayudante),
    id_edificio: Number(body.id_edificio),
  });

  const inspector = await db(DatabaseTable.usuarios)
    .select("id_usuario", "rol")
    .where({ id_usuario: parsed.id_inspector, activo: true })
    .first();
  if (!inspector || inspector.rol !== "inspector") {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "El usuario indicado como inspector no existe, no está activo o no tiene rol inspector"
    );
  }

  const ayudante = await db(DatabaseTable.usuarios)
    .select("id_usuario", "rol")
    .where({ id_usuario: parsed.id_ayudante, activo: true })
    .first();
  if (!ayudante || ayudante.rol !== "ayudante") {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "El usuario indicado como ayudante no existe, no está activo o no tiene rol ayudante"
    );
  }

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

  const existing = await db(DatabaseTable.asignacionesAyudante)
    .where(parsed)
    .first();
  if (existing) {
    throw new utils.CustomError(
      AnomalyCode.incompleteData,
      "Ya existe una asignación para este inspector, ayudante y edificio"
    );
  }

  return await assignmentRepository.createAssignment(parsed);
};

const getAssignmentsByHelper = async (idAyudante) => {
  return await assignmentRepository.getAssignmentsByHelper(Number(idAyudante));
};

const getAssignmentsByInspector = async (idInspector) => {
  return await assignmentRepository.getAssignmentsByInspector(Number(idInspector));
};

const assignmentService = {
  getAvailableHelpers,
  findHelperByCedula,
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
};

export default assignmentService;
