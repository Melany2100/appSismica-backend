import { z } from "zod";

export const AssignmentSchema = z.object({
  id_inspector: z
    .number({ required_error: "id_inspector es requerido" })
    .int()
    .positive("id_inspector debe ser un entero positivo"),

  id_ayudante: z
    .number({ required_error: "id_ayudante es requerido" })
    .int()
    .positive("id_ayudante debe ser un entero positivo"),

  id_edificio: z
    .number({ required_error: "id_edificio es requerido" })
    .int()
    .positive("id_edificio debe ser un entero positivo"),
});
