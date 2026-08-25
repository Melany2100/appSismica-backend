import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
userRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));
/**
 * @swagger
 * /users/byRole/{role}:
 *   get:
 *     summary: Obtener lista de usuarios por rol
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: Rol de los usuarios a obtener
 *         example: inspector
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: Juan Pérez
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: juan@ejemplo.com
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.get("/byRole/:role", userController.getUsersByRole);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios activos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Juan Carlos Pérez"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "juan.perez@ejemplo.com"
 *                   cedula:
 *                     type: string
 *                     example: "1234567890"
 *                   telefono:
 *                     type: string
 *                     example: "0987654321"
 *                   rol:
 *                     type: string
 *                     enum: [admin, inspector, ayudante]
 *                     example: "inspector"
 *                   direccion:
 *                     type: string
 *                     example: "Av. Principal 123, Quito"
 *                   foto_perfil_url:
 *                     type: string
 *                     example: "https://storage.googleapis.com/bucket/users/foto.jpg"
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Obtener todos los usuarios registrados, activos e inactivos (Solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuarios obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
userRouter.get(
  "/all",
  authMiddleware.requireAdmin.bind(authMiddleware),
  userController.getAllUsers
);

userRouter.get("/", userController.getAllActiveUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan Carlos Pérez"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "juan.perez@ejemplo.com"
 *                 cedula:
 *                   type: string
 *                   example: "1234567890"
 *                 telefono:
 *                   type: string
 *                   example: "0987654321"
 *                 direccion:
 *                   type: string
 *                   example: "Av. Principal 123, Quito"
 *                 foto_perfil_url:
 *                   type: string
 *                   example: "https://storage.googleapis.com/bucket/users/foto.jpg"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 */

userRouter.get(
  "/inactive",
  authMiddleware.requireAdmin.bind(authMiddleware),
  userController.getInactiveUsers
);


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan Carlos Pérez"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "juan.perez@ejemplo.com"
 *                 cedula:
 *                   type: string
 *                   example: "1234567890"
 *                 telefono:
 *                   type: string
 *                   example: "0987654321"
 *                 direccion:
 *                   type: string
 *                   example: "Av. Principal 123, Quito"
 *                 foto_perfil_url:
 *                   type: string
 *                   example: "https://storage.googleapis.com/bucket/users/foto.jpg"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 */
userRouter.get("/:id", userController.getUserById);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar datos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 5
 *                 example: "Juan Carlos Pérez"
 *                 description: Nombre del usuario (mínimo 5 caracteres)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@ejemplo.com"
 *                 description: Correo electrónico del usuario
 *               cedula:
 *                 type: string
 *                 pattern: '^\d{10}$'
 *                 example: "1234567890"
 *                 description: Cédula de identidad (10 dígitos)
 *               telefono:
 *                 type: string
 *                 maxLength: 10
 *                 example: "0987654321"
 *                 description: Número de teléfono (máximo 10 dígitos)
 *               currentPassword:
 *                 type: string
 *                 example: "password123"
 *                 description: Contraseña actual (requerida para cambiar contraseña)
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 pattern: '^(?=.*[A-Z])(?=.*\d)'
 *                 example: "NewPassword123"
 *                 description: Nueva contraseña (mínimo 6 caracteres, al menos 1 mayúscula y 1 número)
 *               foto_perfil:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (JPG o PNG)
 *             example:
 *               nombre: "Juan Carlos Pérez"
 *               email: "juan.perez@ejemplo.com"
 *               cedula: "1234567890"
 *               telefono: "0987654321"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan Carlos Pérez"
 *                 email:
 *                   type: string
 *                   example: "juan.perez@ejemplo.com"
 *                 cedula:
 *                   type: string
 *                   example: "1234567890"
 *                 foto_perfil_url:
 *                   type: string
 *                   example: "https://storage.googleapis.com/bucket/users/foto.jpg"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Datos de entrada inválidos"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "email"
 *                       message:
 *                         type: string
 *                         example: "El correo no es válido"
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.put("/:id", upload.single("foto_perfil"), userController.updateUser);
/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Actualizar rol de un usuario (Solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rol
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [admin, inspector, ayudante]
 *                 example: "inspector"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.patch(
  "/:id/role", 
  authMiddleware.requireAdmin.bind(authMiddleware), 
  userController.updateUserRole
);


/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Activar o desactivar un usuario (Solo administradores)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado - Se requieren permisos de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
userRouter.patch(
  "/:id/status",
  authMiddleware.requireAdmin.bind(authMiddleware),
  userController.updateUserStatus
);
export default userRouter;
