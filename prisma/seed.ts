import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// IDs fixos garantem que o frontend (que hardcoda "cat-income" no initialForm) funcione
const defaults = [
  { id: "cat-income",    name: "income",    displayName: "Renda",       icon: "work",                color: "#DE9AC3" },
  { id: "cat-food",      name: "food",      displayName: "Alimentação", icon: "fastfood",            color: "#DEA17B" },
  { id: "cat-house",     name: "house",     displayName: "Casa",        icon: "home",                color: "#E6E088" },
  { id: "cat-education", name: "education", displayName: "Educação",    icon: "book",                color: "#AB8FBE" },
  { id: "cat-travel",    name: "travel",    displayName: "Viagens",     icon: "airplanemode-active", color: "#82C9DE" },
];

async function main() {
  for (const cat of defaults) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: { ...cat, isDefault: true },
    });
  }
  console.log("✅ Seed concluído: 5 categorias padrão inseridas com IDs fixos.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
