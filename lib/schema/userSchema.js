import { z } from "zod";

export const UpdateUserSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es requerido")
    .min(5, "El nombre debe tener al menos 5 caracteres")
    .optional(),

  email: z
    .string()
    .trim()
    .email("El correo no es válido")
    .optional(),

  cedula: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "La cédula debe tener 10 dígitos")
    .optional(),

  telefono: z
    .string()
    .trim()
    .max(10, "El número de teléfono no debe superar 10 dígitos")
    .optional(),

  currentPassword: z
    .string()
    .trim()
    .optional(),

  password: z
    .string()
    .trim()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número")
    .optional(),

  foto_perfil: z
    .custom((file) => !file || (file && file.buffer), "Archivo de imagen inválido")
    .refine(
      (file) =>
        !file ||
        (file.buffer && ["image/jpeg", "image/png"].includes(file.mimetype)),
      "El archivo debe ser una imagen JPG o PNG"
    )
    .optional(),
})
.refine((data) => {
  if (data.password && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Debe proporcionar la contraseña actual para cambiar la contraseña",
  path: ["currentPassword"]
});
export const UpdateRoleSchema = z.object({
  rol: z
    .enum(["admin", "inspector", "ayudante"], {
      errorMap: () => ({
        message: "El rol debe ser admin, inspector o ayudante",
      }),
    }),
});
export const UpdateStatusSchema = z.object({
  activo: z.boolean({
    required_error: "El campo activo es requerido",
    invalid_type_error: "El campo activo debe ser verdadero (true) o falso (false)",
  }),
});