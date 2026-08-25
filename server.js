import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./lib/routes/authRouter.js";
import userRouter from "./lib/routes/userRouter.js";
import catalogueRouter from "./lib/routes/catalogueRouter.js";
import { swaggerSpec, swaggerUiExpress } from "./swagger.js";
import buildingRouter from "./lib/routes/buildingRouter.js";
import inspectionRouter from "./lib/routes/inspectionRouter.js";
import assignmentRouter from "./lib/routes/assignmentRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors("*"));

app.listen(PORT, () => {
  console.log(`\nServer started at ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Buenas :D");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Configurar keep-alive
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5, max=100000');
  next();
}); 



app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/catalogues", catalogueRouter);
app.use("/buildings", buildingRouter);
app.use("/inspections", inspectionRouter);
app.use("/assignments", assignmentRouter);


