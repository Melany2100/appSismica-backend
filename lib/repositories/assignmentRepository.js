import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import db from "../../data/database.js";
import DatabaseTable from "../../data/databaseTables.js";

const getAvailableHelpers = async () => {
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
      .where({ rol: "ayudante", activo: true })
      .orderBy("nombre", "asc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      `Error al obtener ayudantes: ${error.message}`
    );
  }
};

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
      `Error al buscar ayudante: ${error.message}`
    );
  }
};

const createAssignment = async (assignmentData) => {
  const trx = await db.transaction();
  try {
    const [assignment] = await trx(DatabaseTable.asignacionesAyudante)
      .insert(assignmentData)
      .returning("*");

    await trx(DatabaseTable.notificaciones).insert({
      id_usuario: assignmentData.id_ayudante,
      titulo: "Nueva asignación",
      mensaje: "Has sido asignado a un nuevo edificio por tu inspector.",
      tipo: "asignacion",
    });

    await trx.commit();
    return assignment;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      `Error al crear asignación: ${error.message}`
    );
  }
};

const getAssignmentsByHelper = async (idAyudante) => {
  try {
    return await db(`${DatabaseTable.asignacionesAyudante} as a`)
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
        "u.nombre as nombre_inspector",
        "u.foto_perfil_url as foto_inspector"
      )
      .join(`${DatabaseTable.edificios} as e`, "a.id_edificio", "e.id_edificio")
      .join(`${DatabaseTable.usuarios} as u`, "a.id_inspector", "u.id_usuario")
      .where("a.id_ayudante", idAyudante)
      .orderBy("a.fecha_asignacion", "desc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      `Error al obtener asignaciones del ayudante: ${error.message}`
    );
  }
};

const getAssignmentsByInspector = async (idInspector) => {
  try {
    return await db(`${DatabaseTable.asignacionesAyudante} as a`)
      .select(
        "a.id_asignacion",
        "a.estado",
        "a.fecha_asignacion",
        "e.id_edificio",
        "e.nombre_edificio",
        "e.direccion",
        "e.ciudad",
        "e.foto_edificio_url",
        "u.id_usuario as id_ayudante",
        "u.nombre as nombre_ayudante",
        "u.cedula as cedula_ayudante",
        "u.foto_perfil_url as foto_ayudante"
      )
      .join(`${DatabaseTable.edificios} as e`, "a.id_edificio", "e.id_edificio")
      .join(`${DatabaseTable.usuarios} as u`, "a.id_ayudante", "u.id_usuario")
      .where("a.id_inspector", idInspector)
      .orderBy("a.fecha_asignacion", "desc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      `Error al obtener asignaciones del inspector: ${error.message}`
    );
  }
};

const assignmentRepository = {
  getAvailableHelpers,
  findHelperByCedula,
  createAssignment,
  getAssignmentsByHelper,
  getAssignmentsByInspector,
};

export default assignmentRepository;
