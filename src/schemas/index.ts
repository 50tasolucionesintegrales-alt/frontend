import { z } from 'zod';

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

const numOpt = z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? undefined : v),
        z.coerce.number().finite().optional()
)

export const updateItemSchema = z.object({
        itemId: z.union([z.string(), z.number()]).transform(String),
        quoteId: z.union([z.string(), z.number()]).transform(String),

        cantidad: numOpt, // si en algún momento lo editas
        unidad: z.string().optional(),

        margenPct1: numOpt,
        margenPct2: numOpt,
        margenPct3: numOpt,
        margenPct4: numOpt,
        margenPct5: numOpt,
        margenPct6: numOpt,
        margenPct7: numOpt,
        margenPct8: numOpt,
        margenPct9: numOpt,
        margenPct10: numOpt,
}).strip()

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

export const ItemSchema = z.object({
        id: z.string(),
        product: ProductSchema,
        service: ServiceSchema.optional().nullable(),
        cantidad: z.number(),
        costo_unitario: z.number(),
        imageUrl: z.string().url().nullable().optional(),
        margenPct1: z.number(),
        margenPct2: z.number(),
        margenPct3: z.number(),
        margenPct4: z.number(),
        margenPct5: z.number(),
        margenPct6: z.number(),
        margenPct7: z.number(),
        margenPct8: z.number(),
        margenPct9: z.number(),
        margenPct10: z.number(),
        precioFinal1: z.number(),
        precioFinal2: z.number(),
        precioFinal3: z.number(),
        precioFinal4: z.number(),
        precioFinal5: z.number(),
        precioFinal6: z.number(),
        precioFinal7: z.number(),
        precioFinal8: z.number(),
        precioFinal9: z.number(),
        precioFinal10: z.number(),
        subtotal1: z.number(),
        subtotal2: z.number(),
        subtotal3: z.number(),
        subtotal4: z.number(),
        subtotal5: z.number(),
        subtotal6: z.number(),
        subtotal7: z.number(),
        subtotal8: z.number(),
        subtotal9: z.number(),
        subtotal10: z.number(),
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
        totalMargen4: z.number(),
        totalMargen5: z.number(),
        totalMargen6: z.number(),
        totalMargen7: z.number(),
        totalMargen8: z.number(),
        totalMargen9: z.number(),
        totalMargen10: z.number(),
        pdf1: z.string(),
        pdf2: z.string(),
        pdf3: z.string(),
        pdf4: z.string(),
        pdf5: z.string(),
        pdf6: z.string(),
        pdf7: z.string(),
        pdf8: z.string(),
        pdf9: z.string(),
        pdf10: z.string(),
        items: z.array(ItemSchema),
});

// 5. Array de cotizaciones
export const QuotesSchema = z.array(QuoteSchema);

// Inferencia de tipos (opcional)
export type Quote = z.infer<typeof QuoteSchema>;
export type Quotes = z.infer<typeof QuotesSchema>;

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
        evidenceSize: z.number().nullable(),
        evidenceUrl: z.string().url().nullable(),
        createdAt: z.string(),
        status: z.enum(['pending', 'approved', 'rejected']),
        rejectReason: z.string().nullable(),
        approvedAt: z.string().nullable()
})

export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>

export const OrderSchema = z.object({
        id: z.string(),
        user: userSchema,
        titulo: z.string(),
        descripcion: z.string(),
        status: z.enum([
                "draft",
                "sent",
                "approved",
                "rejected",
                "partially_approved",
        ]),
        createdAt: z.string(),
        sentAt: z.string().nullable(),
        resolvedAt: z.string().nullable(),
        total: z.number(),
        progressPct: z.number(),
        items: z.array(PurchaseOrderItemSchema),
});

export type Order = z.infer<typeof OrderSchema>;

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
        image_url?: string | null
        hasImage?: boolean
        createdAt: string;
}

export type Categoria = {
        id: string,
        nombre: string,
        descripcion: string | null
}

export const TemplateSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  archivo: z
    .object({
      type: z.string(),
      data: z.array(z.number()),
    })
    .optional(),
});

export const TemplatesSchema = z.array(TemplateSchema);

export type Template = z.infer<typeof TemplateSchema>;
export type Templates = z.infer<typeof TemplatesSchema>;