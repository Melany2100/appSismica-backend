import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import bucket from "../supabase/supabase.js";


const getBuildings = async () => {
  try {
    return await db(DatabaseTable.edificios + " as e")
      .select(
        "e.*",
        "u.nombre as nombre_inspector", 
        "i.fecha_inspeccion",
        "i.estado as estado_inspeccion",
        
        db.raw("COALESCE(i.puntuacion_final, 0) as puntuacion_final")
      )
      .leftJoin("inspecciones as i", "e.id_edificio", "i.id_edificio")
      .leftJoin("usuarios as u", "i.id_usuario", "u.id_usuario")
      .orderBy("e.created_at", "desc");
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener edificios con inspectores: " + error.message
    );
  }
};



const uploadBuildingFiles = async (buildingData) => {
  const urls = {};

  if (buildingData.foto_edificio) {
    const data = await bucket.uploadFile(
      buildingData.foto_edificio,
      "building/foto"
    );

    urls.foto_edificio_url =
      `${process.env.SUPABASE_URL}/storage/v1/object/public/` +
      `${process.env.STORAGE_BUCKET}/${data.path}`;
  }

  if (buildingData.grafico_edificio) {
    const data = await bucket.uploadFile(
      buildingData.grafico_edificio,
      "building/grafico"
    );

    urls.grafico_edificio_url =
      `${process.env.SUPABASE_URL}/storage/v1/object/public/` +
      `${process.env.STORAGE_BUCKET}/${data.path}`;
  }

  return urls;
};


const createBuilding = async (buildingData) => {
  const trx = await db.transaction();

  try {
    const urls = await uploadBuildingFiles(buildingData);

    buildingData = {
      ...buildingData,
      ...urls,
    };

    delete buildingData.foto_edificio;
    delete buildingData.grafico_edificio;

    const building = await trx(DatabaseTable.edificios)
      .insert(buildingData)
      .returning("*");

    await trx.commit();
    return building[0];

  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      error.message
    );
  }
};



const updateBuilding = async (id, buildingData) => {
  const trx = await db.transaction();

  try {
    const urls = await uploadBuildingFiles(buildingData);

    buildingData = {
      ...buildingData,
      ...urls,
    };

    delete buildingData.foto_edificio;
    delete buildingData.grafico_edificio;

    const building = await trx(DatabaseTable.edificios)
      .update(buildingData)
      .where("id_edificio", id)
      .returning("*");

    await trx.commit();
    return building[0];

  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      error.message
    );
  }
};



const deleteBuilding = async (id) => {
  const trx = await db.transaction();

  try {
    const res = await trx(DatabaseTable.edificios)
      .where("id_edificio", id)
      .delete();

    await trx.commit();
    return res > 0;

  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      error.message
    );
  }
};


export default {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
