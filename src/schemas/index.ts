import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const registerSchema = z.object({
        nombre: z.string()
                .min(1, { message: "El nombre es obligatorio" }),
        email: z.string()
                .email({ message: "E-mail no válido" }),
        password: z.string()
                .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
        password2: z.string(),
}).refine((data) => data.password === data.password2, {
        message: "Las contraseñas no coinciden",
        path: ["password2"],
})

export const loginSchema = z.object({
        email: z.string()
                .min(1, { message: "El email es obligatorio" })
                .email({ message: "E-mail no válido" }),
        password: z.string()
                .min(8, { message: "La contraseña es obligatoria" }),
})

export const TokenSchema = z.string({ message: "El token no es válido" })
        .length(6, { message: "El token no es válido" })

export const forgotPasswordSchema = z.object({
        email: z.string()
                .min(1, { message: "El email es obligatorio" })
                .email({ message: "E-mail no válido" })
})


export const successSchema = z.object({
        message: z.string(),
})

export const errorSchema = z.object({
        error: z.string()
})

const rawUserSchema = z.object({
        sub: z.number(),
        nombre: z.string(),
        email: z.string().email(),
        rol: z.enum(["admin", "cotizador", "comprador", "unassigned"]),
});

export const userSchema = rawUserSchema.transform((u) => ({
        ...u,
        id: u.sub,
}));

export type User = z.infer<typeof userSchema>;

export const resetPassSchema = z.object({
        password: z.string()
                .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
        confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
})

export const updatePassSchema = z.object({
        current_password: z.string()
                .min(8, { message: "La contraseña actual debe tener al menos 8 caracteres" }),
        password: z.string()
                .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
        confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
})

export const assignRoleSchema = z.object({
        userId: z
                .string()
                .transform((v) => Number(v))
                .pipe(z.number().int().positive()),
        rol: z.enum(["cotizador", "comprador"]),
});