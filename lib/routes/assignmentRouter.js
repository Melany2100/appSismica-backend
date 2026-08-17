import express from "express";
import assignmentController from "../controllers/assignmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const assignmentRouter = express.Router();

// Todas las rutas requieren autenticación
assignmentRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Crear asignación — Inspector asigna un ayudante a un edificio
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_inspector
 *               - id_ayudante
 *               - id_edificio
 *             properties:
 *               id_inspector:
 *                 type: integer
 *                 example: 1
 *               id_ayudante:
 *                 type: integer
 *                 example: 3
 *               id_edificio:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Asignación creada exitosamente
 *       400:
 *         description: Datos inválidos o rol incorrecto
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
assignmentRouter.post("/", assignmentController.createAssignment);

/**
 * @swagger
 * /assignments/helper/search:
 *   get:
 *     summary: Buscar ayudante por cédula (para el buscador del inspector)
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *         example: "0950207267"
 *     responses:
 *       200:
 *         description: Ayudante encontrado
 *       404:
 *         description: No se encontró ayudante con esa cédula
 */
assignmentRouter.get(
  "/helper/search",
  assignmentController.findHelperByCedula
);

/**
 * @swagger
 * /assignments/helper/{id_ayudante}:
 *   get:
 *     summary: Obtener asignaciones de un ayudante (Home Ayudante)
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ayudante
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Lista de asignaciones (puede ser vacía)
 */
assignmentRouter.get(
  "/helper/:id_ayudante",
  assignmentController.getAssignmentsByHelper
);

/**
 * @swagger
 * /assignments/inspector/{id_inspector}:
 *   get:
 *     summary: Obtener asignaciones creadas por un inspector
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_inspector
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de asignaciones del inspector
 */
assignmentRouter.get(
  "/inspector/:id_inspector",
  assignmentController.getAssignmentsByInspector
);

export default assignmentRouter;