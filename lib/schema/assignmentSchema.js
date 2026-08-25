import z from "zod";

export const AssignmentSchema = z.object({
  id_inspector: z.number().int().positive(),
  id_ayudante: z.number().int().positive(),
  id_edificio: z.number().int().positive(),
});
