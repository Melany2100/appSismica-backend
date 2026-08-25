import dotenv from "dotenv";
dotenv.config();

const schema = process.env.DB_TEST_SCHEMA;

const usuarios = `${schema}.usuarios`;
const tokensRecuperacion = `${schema}.tokens_recuperacion`;
const catalogos = `${schema}.catalogos`;
const edificios = `${schema}.edificios`;
const archivosEdificio = `${schema}.archivos_edificio`;
const inspecciones = `${schema}.inspecciones`;
const archivosInspeccion = `${schema}.archivos_inspeccion`;
const comentariosInspeccion = `${schema}.comentarios_inspeccion`;
const matrizPuntuacion = `${schema}.matriz_puntuacion`;
const resultadosInspeccion = `${schema}.resultados_inspeccion`;
const historialAuditoria = `${schema}.historial_auditoria`;
const asignacionesAyudante = `${schema}.asignaciones_ayudante`;
const notificaciones = `${schema}.notificaciones`;

const DatabaseTable = {
  usuarios,
  tokensRecuperacion,
  catalogos,
  edificios,
  archivosEdificio,
  inspecciones,
  archivosInspeccion,
  comentariosInspeccion,
  matrizPuntuacion,
  resultadosInspeccion,
  historialAuditoria,
  asignacionesAyudante,
  notificaciones,
};

export default DatabaseTable;
