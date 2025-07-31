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
})

export const updateItemSchema = z.object({
        cantidad: z.coerce.number(),
        margenPct1: z.coerce.number(),
        margenPct2: z.coerce.number(),
        margenPct3: z.coerce.number(),
        itemId: z.coerce.number(),
        quoteId: z.coerce.number()
})

const CategorySchema = z.object({
        id: z.string(),
        nombre: z.string(),
        descripcion: z.string(),
});

export const ProductSchema = z.object({
        id: z.string(),
        category: CategorySchema,
        nombre: z.string(),
        descripcion: z.string(),
        precio: z.string(),
        especificaciones: z.string().nullable(),
        link_compra: z.string().url(),
        image_url: z.string().url(),
        createdAt: z.string().datetime(),
});

export const ItemSchema = z.object({
        id: z.string(),
        product: ProductSchema,
        service: z.null(),
        cantidad: z.number(),
        costo_unitario: z.number(),
        margenPct1: z.number(),
        margenPct2: z.number(),
        margenPct3: z.number(),
        precioFinal1: z.number(),
        precioFinal2: z.number(),
        precioFinal3: z.number(),
        subtotal1: z.number(),
        subtotal2: z.number(),
        subtotal3: z.number(),
});

export type Item = z.infer<typeof ItemSchema>

const QuoteSchema = z.object({
        id: z.string(),
        status: z.string(),
        createdAt: z.string().datetime(),
        sentAt: z.string().datetime(),
        tipo: z.string(),
        titulo: z.string(),
        descripcion: z.string(),
        totalMargen1: z.number(),
        totalMargen2: z.number(),
        totalMargen3: z.number(),
        pdf1: z.string(),
        pdf2: z.string(),
        pdf3: z.string(),
        items: z.array(ItemSchema),
});

// 5. Array de cotizaciones
export const QuotesSchema = z.array(QuoteSchema);

// Inferencia de tipos (opcional)
export type Quote = z.infer<typeof QuoteSchema>;
export type Quotes = z.infer<typeof QuotesSchema>;

export const ServiceSchema = z.object({
        id: z.string(),
        createdBy: userSchema,
        nombre: z.string(),
        descripcion: z.string(),
        precioBase: z.string(),
        createdAt: z.string().datetime(),
})

export const ServicesSchema = z.array(ServiceSchema)

// Tipos inferidos (opcional)
export type Service = z.infer<typeof ServiceSchema>

export const AddServiceSchema = z.object({
        nombre: z.string().min(1, 'El nombre es obligatorio'),
        descripcion: z.string().min(1, 'La descripción es obligatoria'),
        precioBase: z.string().min(1, 'El precio base es obligatorio'),
})


export const OrderSummarySchema = z.object({
        id: z.string(),
        titulo: z.string(),
        descripcion: z.string().nullable(),
        status: z.enum(['draft', 'sent', 'partially_approved', 'approved', 'rejected']),
        createdAt: z.string(),
        sentAt: z.string().nullable(),
        resolvedAt: z.string().nullable(),
        total: z.number().nullable(),
        progressPct: z.number().nullable()
})


export const PurchaseOrderItemSchema = z.object({
        id: z.string(),
        order: OrderSummarySchema,
        product: ProductSchema,
        cantidad: z.number(),
        costo_unitario: z.number(),
        subtotal: z.number(),
        evidenceUrl: z.string().url().nullable(),
        status: z.enum(['pending', 'approved', 'rejected']),
        rejectReason: z.string().nullable(),
        approvedAt: z.string().nullable()
})

export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>

// Types
export type Producto = {
        id: string;
        category: {
                id: string;
                nombre: string;
                descripcion?: string | null;
        };
        createdBy?: {
                id: number;
                nombre: string;
                email: string;
                password: string;
                token: string;
                confirmed: boolean;
                rol: string;
                googleId?: string | null;
                avatar?: string | null;
                createdAt: string;
                updatedAt: string;
        } | null;
        nombre: string;
        descripcion?: string | null;
        precio: string;
        especificaciones?: string | null;
        link_compra: string;
        image_url: string;
        createdAt: string;
}

export type Categoria = {
        id: string,
        nombre: string,
        descripcion: string | null
}

