import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import buildingController from "../controllers/buildingController.js";
import sessionMiddleware from "../middleware/sessionMiddleware.js";
import multer from "multer";

const buildingRouter = express.Router();
buildingRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /buildings:
 *   get:
 *     summary: Obtener lista de todos los edificios
 *     tags: [Edificios]
 *     responses:
 *       200:
 *         description: Lista de edificios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_edificio:
 *                     type: integer
 *                     example: 1
 *                   nombre_edificio:
 *                     type: string
 *                     example: "nombreEjemplod"
 *                   direccion:
 *                     type: string
 *                     example: "ejemdirec"
 *                   ciudad:
 *                     type: string
 *                     example: "gye"
 *                   codigo_postal:
 *                     type: string
 *                     example: "1234"
 *                   uso_principal:
 *                     type: string
 *                     example: "para algo"
 *                   latitud:
 *                     type: string
 *                     example: "15.230000"
 *                     description: "Coordenada de latitud como string"
 *                   longitud:
 *                     type: string
 *                     example: "20.250000"
 *                     description: "Coordenada de longitud como string"
 *                   numero_pisos:
 *                     type: integer
 *                     example: 5
 *                   area_total_piso:
 *                     type: string
 *                     example: "20.00"
 *                     description: "Área total como string con decimales"
 *                   anio_construccion:
 *                     type: integer
 *                     example: 2010
 *                   anio_codigo:
 *                     type: integer
 *                     example: 2011
 *                   ampliacion:
 *                     type: boolean
 *                     example: true
 *                   anio_ampliacion:
 *                     type: integer
 *                     example: 2012
 *                     nullable: true
 *                   ocupacion:
 *                     type: string
 *                     example: "ocupejem"
 *                   historico:
 *                     type: boolean
 *                     example: true
 *                   albergue:
 *                     type: boolean
 *                     example: false
 *                   gubernamental:
 *                     type: boolean
 *                     example: true
 *                   unidades:
 *                     type: integer
 *                     example: 5
 *                   otras_identificaciones:
 *                     type: string
 *                     example: "no se"
 *                     nullable: true
 *                   comentarios:
 *                     type: string
 *                     example: null
 *                     nullable: true
 *                   fecha_registro_edificio:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-04T07:20:22.083Z"
 *                     description: "Fecha de registro en formato ISO 8601"
 *                   foto_edificio_url:
 *                     type: string
 *                     format: uri
 *                     example: "https://storage.googleapis.com/sistema-vulnerabilidad-sismica.firebasestorage.app/building/foto/1756952422103-GzqN7xEWwAAhNEC.jpeg"
 *                     description: "URL de la foto del edificio almacenada en Firebase Storage"
 *                   grafico_edificio_url:
 *                     type: string
 *                     format: uri
 *                     example: "https://storage.googleapis.com/sistema-vulnerabilidad-sismica.firebasestorage.app/building/grafico/1756952424803-GzqN9zDWsAA6Bo0.jpeg"
 *                     description: "URL del gráfico/plano del edificio almacenado en Firebase Storage"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
buildingRouter.get(
  "/",
  sessionMiddleware.addSession,
  buildingController.getBuildings
);

/**
 * @swagger
 * /buildings:
 *   post:
 *     summary: Crear un nuevo edificio
 *     tags: [Edificios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_edificio
 *               - direccion
 *               - ciudad
 *               - codigo_postal
 *               - uso_principal
 *               - latitud
 *               - longitud
 *               - numero_pisos
 *               - area_total_piso
 *               - anio_construccion
 *               - anio_codigo
 *               - ampliacion
 *               - ocupacion
 *               - historico
 *               - albergue
 *               - gubernamental
 *               - unidades
 *             properties:
 *               nombre_edificio:
 *                 type: string
 *                 example: "Torre Central"
 *               direccion:
 *                 type: string
 *                 example: "Av. Principal 123"
 *               ciudad:
 *                 type: string
 *                 example: "Quito"
 *               codigo_postal:
 *                 type: string
 *                 example: "170501"
 *               uso_principal:
 *                 type: string
 *                 example: "Oficinas"
 *               latitud:
 *                 type: number
 *                 format: float
 *                 example: -0.1807
 *               longitud:
 *                 type: number
 *                 format: float
 *                 example: -78.4678
 *               numero_pisos:
 *                 type: integer
 *                 example: 15
 *               area_total_piso:
 *                 type: number
 *                 format: float
 *                 example: 500.5
 *               anio_construccion:
 *                 type: integer
 *                 example: 2010
 *               anio_codigo:
 *                 type: integer
 *                 example: 2008
 *               ampliacion:
 *                 type: boolean
 *                 example: false
 *               anio_ampliacion:
 *                 type: integer
 *                 example: 2015
 *                 description: "Opcional - Solo si ampliacion es true"
 *               ocupacion:
 *                 type: string
 *                 example: "Comercial"
 *               historico:
 *                 type: boolean
 *                 example: false
 *               albergue:
 *                 type: boolean
 *                 example: false
 *               gubernamental:
 *                 type: boolean
 *                 example: true
 *               unidades:
 *                 type: integer
 *                 example: 50
 *               otras_identificaciones:
 *                 type: string
 *                 example: "Código municipal: ABC123"
 *                 description: "Opcional"
 *               comentarios:
 *                 type: string
 *                 example: "Edificio con certificación LEED"
 *                 description: "Opcional"
 *               foto_edificio:
 *                 type: string
 *                 format: binary
 *                 description: "Foto del edificio (JPG o PNG)"
 *               grafico_edificio:
 *                 type: string
 *                 format: binary
 *                 description: "Plano o gráfico del edificio (JPG o PNG)"
 *     responses:
 *       201:
 *         description: Edificio creado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
buildingRouter.post(
  "/",
  sessionMiddleware.addSession,
  upload.fields([
    { name: "foto_edificio", maxCount: 1 },
    { name: "grafico_edificio", maxCount: 1 },
  ]),
  buildingController.createBuilding
);

/**
 * @swagger
 * /buildings/{id}:
 *   put:
 *     summary: Actualizar un edificio existente
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del edificio a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_edificio:
 *                 type: string
 *                 example: "Torre Central Actualizada"
 *               direccion:
 *                 type: string
 *                 example: "Av. Principal 123"
 *               ciudad:
 *                 type: string
 *                 example: "Quito"
 *               codigo_postal:
 *                 type: string
 *                 example: "170501"
 *               uso_principal:
 *                 type: string
 *                 example: "Oficinas"
 *               latitud:
 *                 type: number
 *                 format: float
 *                 example: -0.1807
 *               longitud:
 *                 type: number
 *                 format: float
 *                 example: -78.4678
 *               numero_pisos:
 *                 type: integer
 *                 example: 15
 *               area_total_piso:
 *                 type: number
 *                 format: float
 *                 example: 500.5
 *               anio_construccion:
 *                 type: integer
 *                 example: 2010
 *               anio_codigo:
 *                 type: integer
 *                 example: 2008
 *               ampliacion:
 *                 type: boolean
 *                 example: true
 *               anio_ampliacion:
 *                 type: integer
 *                 example: 2015
 *               ocupacion:
 *                 type: string
 *                 example: "Comercial"
 *               historico:
 *                 type: boolean
 *                 example: false
 *               albergue:
 *                 type: boolean
 *                 example: false
 *               gubernamental:
 *                 type: boolean
 *                 example: true
 *               unidades:
 *                 type: integer
 *                 example: 50
 *               otras_identificaciones:
 *                 type: string
 *                 example: "Código municipal: ABC123"
 *               comentarios:
 *                 type: string
 *                 example: "Edificio renovado en 2023"
 *               foto_edificio:
 *                 type: string
 *                 format: binary
 *                 description: "Nueva foto del edificio (JPG o PNG)"
 *               grafico_edificio:
 *                 type: string
 *                 format: binary
 *                 description: "Nuevo plano o gráfico del edificio (JPG o PNG)"
 *     responses:
 *       201:
 *         description: Edificio actualizado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Edificio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
buildingRouter.put(
  "/:id",
  sessionMiddleware.addSession,
  upload.fields([
    { name: "foto_edificio", maxCount: 1 },
    { name: "grafico_edificio", maxCount: 1 },
  ]),
  buildingController.updateBuilding
);

/**
 * @swagger
 * /buildings/{id}:
 *   delete:
 *     summary: Eliminar un edificio
 *     tags: [Edificios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del edificio a eliminar
 *         example: 1
 *     responses:
 *       201:
 *         description: Edificio eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Edificio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
buildingRouter.delete(
  "/:id",
  sessionMiddleware.addSession,
  buildingController.deleteBuilding
);

export default buildingRouter;
