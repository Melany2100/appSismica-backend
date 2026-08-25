import * as utils from "../../utils.js";
import db from "../../data/database.js";
import AnomalyCode from "../../anomaly.js";
import DatabaseTable from "../../data/databaseTables.js";
import bucket from "../supabase/supabase.js";

const getUsersByRole = async (role) => {
  try {
    const users = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url")
      .where({ rol: role, activo: true }); // Solo usuarios activos
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios"
    );
  }
};

const getAllUsers = async () => {
  try {
    const users = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url", "activo")
      .orderBy("nombre", "asc");
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios registrados"
    );
  }
};

const getAllActiveUsers = async () => {
  try {
    const users = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url")
      .where({ activo: true })
      .orderBy("nombre", "asc");
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios activos"
    );
  }
};

const getInactiveUsers = async () => {
  try {
    const users = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url")
      .where({ activo: false })
      .orderBy("nombre", "asc");
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios inactivos"
    );
  }
};

const updateUser = async (userId, userData, parsedImage) => {
  const domainUrl = process.env.DOMAIN_URL_FIREBASE_STORAGE;
  const trx = await db.transaction();
  let uploadedFile = null;
  let oldImageUrl = null;

  try {
    // Validar contraseña anterior si se quiere cambiar la contraseña
    if (userData.password && userData.currentPassword) {
      const currentUser = await trx(DatabaseTable.usuarios)
        .select("password_hash")
        .where("id_usuario", userId)
        .first();

      if (!currentUser) {
        throw new utils.CustomError(
          AnomalyCode.userDoesNotExist,
          "Usuario no encontrado"
        );
      }

      const isCurrentPasswordValid = await utils.verifyPassword(
        userData.currentPassword,
        currentUser.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new utils.CustomError(
          AnomalyCode.wrongPassword,
          "La contraseña actual es incorrecta"
        );
      }

      // Hash de la nueva contraseña
      userData.password_hash = await utils.hashPassword(userData.password);
      delete userData.password;
      delete userData.currentPassword;
    } else if (userData.password && !userData.currentPassword) {
      throw new utils.CustomError(
        AnomalyCode.missingData,
        "Debe proporcionar la contraseña actual para cambiarla"
      );
    }

  // ... (dentro de updateUser o register)
if (parsedImage) {
  try {
    // Usamos la función exportada: uploadFile(archivo, carpeta)
    const uploadData = await bucket.uploadFile(
      parsedImage.foto_perfil, 
      'users'
    );

    // Para obtener la URL pública (necesitas la ruta retornada)
    const domainUrl = process.env.DOMAIN_URL_SUPABASE_STORAGE; 
    const profilePictureUrl = `${domainUrl}/storage/v1/object/public/${process.env.STORAGE_BUCKET}/${uploadData.path}`;
    
    userData.foto_perfil_url = profilePictureUrl;
  } catch (uploadError) {
    throw new utils.CustomError(AnomalyCode.dataBaseError, "Error al subir imagen: " + uploadError.message);
  }
}
    // --- DENTRO DE updateUser ---
let profilePictureUrl = "";
if (parsedImage) {
  // 1. Generar nombre único
  const fileName = `users/${Date.now()}-${parsedImage.foto_perfil.originalname}`;
  
  // 2. Subir a Supabase Storage (CORRECCIÓN AQUÍ)
  const { data, error: uploadError } = await bucket
    .from('fotos_sistema') // Tu bucket de la captura
    .upload(fileName, parsedImage.foto_perfil.buffer, {
      contentType: parsedImage.foto_perfil.mimetype,
      upsert: true
    });

  if (uploadError) throw uploadError;

  // 3. Obtener URL Pública
  const { data: { publicUrl } } = bucket
    .from('fotos_sistema')
    .getPublicUrl(fileName);

  profilePictureUrl = publicUrl;
  userData.foto_perfil_url = profilePictureUrl;
}

    const [user] = await trx(DatabaseTable.usuarios)
      .update(userData)
      .where("id_usuario", userId)
      .returning([
        "id_usuario",
        "nombre",
        "email",
        "cedula",
        "foto_perfil_url",
      ]);

    // Eliminar la imagen anterior de Firebase si se subió una nueva
    if (parsedImage && oldImageUrl && oldImageUrl.includes(bucket.name)) {
      try {
        const oldFileName = oldImageUrl.split(`${bucket.name}/`)[1];
        const oldFile = bucket.file(oldFileName);
        await oldFile.delete();
        console.log('Imagen anterior eliminada de Firebase');
      } catch (cleanupError) {
        console.error('Error al eliminar imagen anterior:', cleanupError);
      }
    }

    await trx.commit();
    return user;
  } catch (error) {
    await trx.rollback();
    if (uploadedFile) {
      try {
        await uploadedFile.delete();
        console.log('Imagen eliminada de Firebase debido a error en BD');
      } catch (cleanupError) {
        console.error('Error al limpiar imagen de Firebase:', cleanupError);
      }
    }
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};
const getUserById = async (userId) => {
  try {
    // Nota: ya no se filtra por activo=true. El admin necesita poder ver
    // el perfil de usuarios inactivos para poder reactivarlos.
    const user = await db(DatabaseTable.usuarios)
      .select("id_usuario", "nombre", "email", "cedula", "telefono", "rol", "direccion", "foto_perfil_url", "activo")
      .where("id_usuario", userId)
      .first();
    
    return user;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener el usuario"
    );
  }
};


const updateUserStatus = async (userId, activo) => {
  const trx = await db.transaction();

  try {
    const user = await trx(DatabaseTable.usuarios)
      .select("id_usuario")
      .where("id_usuario", userId)
      .first();

    if (!user) {
      await trx.rollback();
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "Usuario no encontrado"
      );
    }

    const [updatedUser] = await trx(DatabaseTable.usuarios)
      .update({ activo })
      .where("id_usuario", userId)
      .returning(["id_usuario", "nombre", "email", "rol", "activo"]);

    await trx.commit();
    return updatedUser;
  } catch (error) {
    await trx.rollback();
    if (error instanceof utils.CustomError) {
      throw error;
    }
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const updateUserRole = async (userId, newRole) => {
  const trx = await db.transaction();
  
  try {
    const user = await getUserById(userId);

    if (!user) {
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "Usuario no encontrado"
      );
    }

    // Actualizar el rol
    const [updatedUser] = await trx(DatabaseTable.usuarios)
      .update({ rol: newRole })
      .where("id_usuario", userId)
      .returning([
        "id_usuario",
        "nombre", 
        "email",
        "rol"
      ]);

    await trx.commit();
    return updatedUser;
  } catch (error) {
    await trx.rollback();
    throw new utils.CustomError(AnomalyCode.dataBaseError, error.message);
  }
};

const getUserByEmail = async (email) => {
  return db(DatabaseTable.usuarios)
    .where({ email })
    .first();
};

const createResetToken = async (idUsuario, token, expiracion) => {
  return db("tokens_recuperacion").insert({
    id_usuario: idUsuario,
    token,
    expiracion
  });
};

const getValidToken = async (token) => {
  return db("tokens_recuperacion")
    .where({ token, usado: false })
    .andWhere("expiracion", ">", new Date())
    .first();
};

const updatePassword = async (idUsuario, hash) => {
  return db(DatabaseTable.usuarios)
    .where({ id_usuario: idUsuario })
    .update({ password_hash: hash });
};

const markTokenUsed = async (token) => {
  return db("tokens_recuperacion")
    .where({ token })
    .update({ usado: true });
};


 
const userRepository = {
  getUsersByRole,
  getAllUsers,
  getAllActiveUsers,
  getInactiveUsers,
  updateUser,
  getUserById,
  updateUserRole,
  getUserByEmail,
  createResetToken,
  getValidToken,
  updatePassword,
  markTokenUsed,
  updateUserStatus
};

export default userRepository;
