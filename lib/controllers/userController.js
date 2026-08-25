import * as utils from "../../utils.js";
import userService from "../service/userService.js";

export const getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const users = await userService.getUsersByRole(role);
    res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};


export const getAllActiveUsers = async (req, res) => {
  try {
    const users = await userService.getAllActiveUsers();
    res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const getInactiveUsers = async (req, res) => {
  try {
    const users = await userService.getInactiveUsers();
    res.status(200).json(users);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    const user = await userService.updateUser(userId, { ...req.body }, { ...req.file });
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUserRole(userId, { ...req.body });
    return res.status(200).json(updatedUser);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await userService.updateUserStatus(userId, { ...req.body });
    return res.status(200).json(updatedUser);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const userController = { getUsersByRole, getAllUsers, getAllActiveUsers, getInactiveUsers, updateUser, getUserById, updateUserRole, updateUserStatus };

export default userController;
