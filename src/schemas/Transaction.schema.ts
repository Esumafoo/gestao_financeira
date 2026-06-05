import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z.string().min(1, "description é obrigatório").max(255),

  // Frontend envia "value" (number) — mapeamos para "amount" no controller
  value: z
    .number({ invalid_type_error: "value deve ser um número" })
    .positive("value deve ser maior que zero"),

  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "date inválida (ISO 8601 esperado)" })
    .transform((v) => new Date(v)),

  // Aceita qualquer string (cuid "cat-income" ou UUID) — validado via FK no Prisma
  categoryId: z.string().min(1, "categoryId é obrigatório"),

  // "type" é opcional: se não vier, inferimos pela categoria (isIncome no seed)
  // Mantemos o campo no schema mas tornamos opcional para compatibilidade com o frontend atual
  type: z
    .enum(["INCOME", "EXPENSE"], {
      errorMap: () => ({ message: 'type deve ser "INCOME" ou "EXPENSE"' }),
    })
    .optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
