import * as utils from "../../utils.js";
import AnomalyCode from "../../anomaly.js";
import userRepository from "../repositories/userRepository.js";
import { UserProfilePictureSchema } from "../schema/authSchema.js";

const getUsersByRole = async (role) => {
  try {
    const users = await userRepository.getUsersByRole(role);
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios"
    );
  }
};

const getAllActiveUsers = async () => {
  try {
    const users = await userRepository.getAllActiveUsers();
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener los usuarios activos"
    );
  }
};

const getAllUsers = async () => {
  try {
    const users = await userRepository.getAllUsers();
    return users;
  } catch (error) {
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener todos los usuarios"
    );
  }
};

const getUserById = async (userId) => {
  try {
    const user = await userRepository.getUserById(userId);
    
    if (!user) {
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "Usuario no encontrado"
      );
    }
    
    return user;
  } catch (error) {
    if (error instanceof utils.CustomError) {
      throw error;
    }
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al obtener el usuario"
    );
  }
};

const updateUser = async (userId, userData, parsedImage) => {
  try {
    let parsedImageProfile;
      utils.isEmptyObject(parsedImage) || parsedImage === null
        ? (parsedImageProfile = null)
        : (parsedImageProfile = UserProfilePictureSchema.parse({
            foto_perfil: parsedImage,
          }));

    const currentUser = await userRepository.getUserById(userId);
    
    if (!currentUser) {
      throw new utils.CustomError(
        AnomalyCode.userDoesNotExist,
        "Usuario no encontrado"
      );
    }

    // Preservar datos existentes si los nuevos están vacíos o nulos
    const updatedData = {
      nombre: userData.nombre && userData.nombre.trim() !== "" 
        ? userData.nombre 
        : currentUser.nombre,
      
      email: userData.email && userData.email.trim() !== "" 
        ? userData.email 
        : currentUser.email,
      
      cedula: userData.cedula && userData.cedula.trim() !== "" 
        ? userData.cedula 
        : currentUser.cedula,
      
      telefono: userData.telefono && userData.telefono.trim() !== "" 
        ? userData.telefono 
        : currentUser.telefono,
      direccion: userData.direccion && userData.direccion.trim() !== "" 
        ? userData.direccion 
        : currentUser.direccion,
    };

    // Solo agregar campos de contraseña si se proporcionan
    if (userData.password && userData.password.trim() !== "") {
      if (!userData.currentPassword || userData.currentPassword.trim() === "") {
        throw new utils.CustomError(
          AnomalyCode.missingData,
          "Debe proporcionar la contraseña actual para cambiarla"
        );
      }
      updatedData.password = userData.password;
      updatedData.currentPassword = userData.currentPassword;
    }
    const updatedUser = await userRepository.updateUser(
      userId, 
      updatedData, 
      parsedImageProfile
    );

    return updatedUser;
  } catch (error) {
    if (error instanceof utils.CustomError) {
      console.log("Error específico en userService:", error); 
      throw error;
    }
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      `Error al actualizar el usuario: ${error.message}`
    );
  }
};
const updateUserRole = async (userId, roleData) => {
  try {
    const updatedUser = await userRepository.updateUserRole(userId, roleData.rol);
    return updatedUser;
  } catch (error) {
    if (error instanceof utils.CustomError) {
      throw error;
    }
    throw new utils.CustomError(
      AnomalyCode.dataBaseError,
      "Error al actualizar el rol del usuario"
    );
  }
};

const updateUserStatus = async (userId, isActive) => {
  try {
    // Verificamos que el usuario exista
    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new utils.CustomError(AnomalyCode.userDoesNotExist, "Usuario no encontrado");
    }
    
    return await userRepository.updateUserStatus(userId, isActive);
  } catch (error) {
    if (error instanceof utils.CustomError) throw error;
    throw new utils.CustomError(AnomalyCode.dataBaseError, "Error al actualizar estado del usuario");
  }
};

const userService = { getUsersByRole, getAllActiveUsers, getAllUsers, updateUser, getUserById, updateUserRole, updateUserStatus };

export default userService;
