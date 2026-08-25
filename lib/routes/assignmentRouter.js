import express from "express";
import assignmentController from "../controllers/assignmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const assignmentRouter = express.Router();

assignmentRouter.use(authMiddleware.authenticateUser.bind(authMiddleware));

assignmentRouter.get(
  "/helpers/available",
  assignmentController.getAvailableHelpers
);
assignmentRouter.get(
  "/helper/search",
  assignmentController.findHelperByCedula
);
assignmentRouter.get(
  "/helper/:id_ayudante",
  assignmentController.getAssignmentsByHelper
);
assignmentRouter.get(
  "/inspector/:id_inspector",
  assignmentController.getAssignmentsByInspector
);
assignmentRouter.post("/", assignmentController.createAssignment);

export default assignmentRouter;
