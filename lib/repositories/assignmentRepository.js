import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";

/**
 * Crea una nueva asignación inspector → ayudante → edificio.
 * También crea una notificación para el ayudante.
 */
const createAssignment = async (assignmentData) => {
  const trx = await db.transaction();
  try {
    const [assignment] = await trx(DatabaseTable.asignacionesAyudante)
      .insert(assignmentData)
      .returning("*");

    // Crear notificación automática para el ayudante
    await trx(DatabaseTable.notificaciones).insert({
      id_usuario: assignmentData.id_ayudante,
      titulo: "Nueva asignación",
      mensaje: `Has sido asignado a un nuevo edificio por tu inspector.`,
      tipo: "asignacion",
    });

    await trx.commit();
    return assignment;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

/**
 * Obtiene todas las asignaciones de un ayudante específico,
 * con datos del edificio e inspector (para el Home Ayudante).
 */
const getAssignmentsByHelper = async (id_ayudante) => {
  try {
    return await db(DatabaseTable.asignacionesAyudante + " as a")
      .select(
        "a.id_asignacion",
        "a.estado",
        "a.fecha_asignacion",
        "e.id_edificio",
        "e.nombre_edificio",
        "e.direccion",
        "e.ciudad",
        "e.latitud",
        "e.longitud",
        "e.foto_edificio_url",
        db.raw(
          "(SELECT COUNT(*) FROM public.inspecciones i WHERE i.id_edificio = e.id_edificio)::int AS numero_inspecciones"
        ),
        "u.nombre AS nombre_inspector",
        "u.foto_perfil_url AS foto_inspector"
      )
      .join(
        DatabaseTable.edificios + " as e",
        "a.id_edificio",
        "e.id_edificio"
      )
      .join(
        DatabaseTable.usuarios + " as u",
        "a.id_inspector",
        "u.id_usuario"
      )
      .where("a.id_ayudante", id_ayudante)
      .orderBy("a.fecha_asignacion", "desc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener asignaciones del ayudante: " + error.message
    );
  }
};

/**
 * Obtiene todas las asignaciones creadas por un inspector,
 * con datos del ayudante y del edificio.
 */
const getAssignmentsByInspector = async (id_inspector) => {
  try {
    return await db(DatabaseTable.asignacionesAyudante + " as a")
      .select(
        "a.id_asignacion",
        "a.estado",
        "a.fecha_asignacion",
        "e.id_edificio",
        "e.nombre_edificio",
        "e.direccion",
        "e.ciudad",
        "e.foto_edificio_url",
        "u.id_usuario AS id_ayudante",
        "u.nombre AS nombre_ayudante",
        "u.cedula AS cedula_ayudante",
        "u.foto_perfil_url AS foto_ayudante"
      )
      .join(
        DatabaseTable.edificios + " as e",
        "a.id_edificio",
        "e.id_edificio"
      )
      .join(
        DatabaseTable.usuarios + " as u",
        "a.id_ayudante",
        "u.id_usuario"
      )
      .where("a.id_inspector", id_inspector)
      .orderBy("a.fecha_asignacion", "desc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener asignaciones del inspector: " + error.message
    );
  }
};

/**
 * Busca un ayudante activo por su número de cédula.
 * Usado por el frontend del inspector para el buscador de ayudantes.
 */
const findHelperByCedula = async (cedula) => {
  try {
    return await db(DatabaseTable.usuarios)
      .select(
        "id_usuario",
        "nombre",
        "cedula",
        "email",
        "telefono",
        "foto_perfil_url"
      )
      .where({ cedula, rol: "ayudante", activo: true })
      .first();
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al buscar ayudante: " + error.message
    );
  }
};

const assignmentRepository = {
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
  findHelperByCedula,
};

export default assignmentRepository;
