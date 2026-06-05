import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createTransactionSchema } from "../schemas/Transaction.schema";

const prisma = new PrismaClient();

// Normaliza o shape de saída: DB usa "amount", frontend espera "value"
function serialize(tx: Record<string, any>) {
  const { amount, ...rest } = tx;
  return { ...rest, value: Number(amount) };
}

// POST /transactions
export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos.", details: parsed.error.flatten() });
    }

    const { description, value, date, categoryId, type } = parsed.data;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    // Infere type pela categoria quando o frontend não envia o campo
    const resolvedType: "INCOME" | "EXPENSE" =
      type ?? (category.name === "income" ? "INCOME" : "EXPENSE");

    const transaction = await prisma.transaction.create({
      data: { description, amount: value, date, type: resolvedType, categoryId },
      include: { category: true },
    });

    res.status(201).json(serialize(transaction));
  } catch (err) {
    next(err);
  }
}

// GET /transactions?month=6&year=2026
export async function listTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const monthRaw = req.query.month as string | undefined;
    const yearRaw  = req.query.year  as string | undefined;

    const monthNum = monthRaw ? parseInt(monthRaw, 10) : null;
    const yearNum  = yearRaw  ? parseInt(yearRaw,  10) : null;

    if (monthRaw !== undefined && (isNaN(monthNum!) || monthNum! < 1 || monthNum! > 12)) {
      return res.status(400).json({ error: "month deve ser um número entre 1 e 12." });
    }
    if (yearRaw !== undefined && (isNaN(yearNum!) || yearNum! < 2000 || yearNum! > 2100)) {
      return res.status(400).json({ error: "year deve ser um número válido (ex: 2026)." });
    }

    let dateFilter: { gte: Date; lte: Date } | undefined;

    if (yearNum) {
      const m = monthNum ?? 1;
      const start      = new Date(yearNum, m - 1, 1);
      const periodEnd  = monthNum
        ? new Date(yearNum, m, 0, 23, 59, 59, 999)       // último dia do mês
        : new Date(yearNum, 12, 0, 23, 59, 59, 999);     // 31/dez do ano

      dateFilter = { gte: start, lte: periodEnd };
    }

    const transactions = await prisma.transaction.findMany({
      where: dateFilter ? { date: dateFilter } : undefined,
      include: { category: true },
      orderBy: { date: "desc" },
    });

    res.json(transactions.map(serialize));
  } catch (err) {
    next(err);
  }
}

// DELETE /transactions/:id
export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.transaction.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Transação não encontrada." });

    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
