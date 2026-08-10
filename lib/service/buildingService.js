import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import buildingRepository from "../repositories/buildingsRepository.js";
import {
  BuildingSchema,
  UpdateBuildingSchema,
} from "../schema/buildingSchema.js";

const getBuildings = async () => {
  const buildings = await buildingRepository.getBuildings();
  return buildings;
};

const createBuilding = async (buildingData, images) => {
  const transformations = {
    latitud: parseFloat,
    longitud: parseFloat,
    numero_pisos: (v) => parseInt(v),
    area_total_piso: parseFloat,
    anio_construccion: (v) => parseInt(v),
    anio_codigo: (v) => parseInt(v),
    anio_ampliacion: (v) => parseInt(v),
    unidades: (v) => parseInt(v),
    ampliacion: (v) => v === "1",
    historico: (v) => v === "1",
    albergue: (v) => v === "1",
    gubernamental: (v) => v === "1",
  };

  Object.entries(transformations).forEach(([key, fn]) => {
    if (buildingData[key] !== undefined) {
      buildingData[key] = fn(buildingData[key]);
    }
  });

  const parsedData = BuildingSchema.parse({
    ...buildingData,
    foto_edificio: images?.foto_edificio || null,
    grafico_edificio: images?.grafico_edificio || null,
  });

  return await buildingRepository.createBuilding(parsedData);
};

const updateBuilding = async (buildingId, buildingData, images) => {
  const transformations = {
    latitud: parseFloat,
    longitud: parseFloat,
    numero_pisos: (v) => parseInt(v),
    area_total_piso: parseFloat,
    anio_construccion: (v) => parseInt(v),
    anio_codigo: (v) => parseInt(v),
    anio_ampliacion: (v) => parseInt(v),
    unidades: (v) => parseInt(v),
    ampliacion: (v) => v === "1",
    historico: (v) => v === "1",
    albergue: (v) => v === "1",
    gubernamental: (v) => v === "1",
  };

  Object.entries(transformations).forEach(([key, fn]) => {
    if (buildingData[key] !== undefined)
      buildingData[key] = fn(buildingData[key]);
  });

  const parsedData = UpdateBuildingSchema.parse({
    ...buildingData,
    foto_edificio:
      images &&
      images.foto_edificio !== undefined &&
      images.foto_edificio !== null &&
      !utils.isEmptyObject(images.foto_edificio)
        ? images.foto_edificio
        : null,
    grafico_edificio:
      images &&
      images.grafico_edificio !== undefined &&
      images.grafico_edificio !== null &&
      !utils.isEmptyObject(images.grafico_edificio)
        ? images.grafico_edificio
        : null,
  });

  return await buildingRepository.updateBuilding(buildingId, parsedData);
};

const deleteBuilding = async (businessId) => {
  const buildings = await buildingRepository.deleteBuilding(businessId);
  return buildings;
};

const buildingService = {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};

export default buildingService;
