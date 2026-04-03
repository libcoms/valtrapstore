import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

async function main() {
  console.log("Seeding database...");

  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Вальтрап конкур «Классик»",
        description:
          "Классический вальтрап для конкура из высококачественного флиса. Идеально держит форму, не скользит. Изготавливается под заказ в любом цвете.",
        category: "valtrap",
        valtrapType: "konkur",
        price: 3500,
        images: [],
        colors: ["Белый", "Чёрный", "Синий", "Бордо", "Зелёный"],
        sizes: [],
        manufacturer: "ArtSaddle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Вальтрап выездка «Элегант»",
        description:
          "Элегантный вальтрап для выездки с фигурным краем и вышивкой. Доступен в стандартных и нестандартных размерах.",
        category: "valtrap",
        valtrapType: "vyezdka",
        price: 4800,
        images: [],
        colors: ["Белый", "Кремовый", "Чёрный", "Тёмно-синий"],
        sizes: [],
        manufacturer: "ArtSaddle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Вальтрап универсальный «Базовый»",
        description:
          "Универсальный вальтрап для ежедневных тренировок. Плотный флис, усиленные швы, анатомический крой.",
        category: "valtrap",
        valtrapType: "universalny",
        price: 2800,
        images: [],
        colors: ["Белый", "Серый", "Чёрный", "Голубой", "Розовый", "Лиловый"],
        sizes: [],
        manufacturer: "HorseStyle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Вальтрап пони «Малыш»",
        description:
          "Специальный вальтрап для пони. Уменьшенный размер, яркие расцветки, мягкий материал.",
        category: "valtrap",
        valtrapType: "pony",
        price: 2200,
        images: [],
        colors: ["Розовый", "Мятный", "Лавандовый", "Жёлтый", "Белый"],
        sizes: [],
        manufacturer: "HorseStyle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Ушки «Базовые»",
        description:
          "Классические ушки из флиса для ежедневного использования. Хорошо защищают уши от насекомых.",
        category: "ushki",
        valtrapType: null,
        price: 800,
        images: [],
        colors: ["Белый", "Чёрный", "Синий", "Бордо", "Зелёный", "Серый"],
        sizes: ["cob", "full", "pony"],
        manufacturer: "ArtSaddle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Ушки «Премиум» с кристаллами",
        description:
          "Ушки с декоративными кристаллами для соревнований. Идеально сочетаются с вальтрапами из той же линейки.",
        category: "ushki",
        valtrapType: null,
        price: 1500,
        images: [],
        colors: ["Белый", "Кремовый", "Чёрный"],
        sizes: ["cob", "full"],
        manufacturer: "ArtSaddle",
        inStock: true,
        isSet: false,
      },
      {
        name: "Комплект конкур «Классик» (вальтрап + ушки)",
        description:
          "Полный комплект для конкура: вальтрап + ушки из одной коллекции. При заказе комплектом скидка 10%.",
        category: "valtrap",
        valtrapType: "konkur",
        price: 3800,
        images: [],
        colors: ["Белый", "Чёрный", "Синий", "Бордо"],
        sizes: ["cob", "full"],
        manufacturer: "ArtSaddle",
        inStock: true,
        isSet: true,
      },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
