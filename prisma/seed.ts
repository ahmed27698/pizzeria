import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "Vegetarian", slug: "vegetarian", description: "Fresh veggie pizzas" },
  { name: "Chicken", slug: "chicken", description: "Tender chicken toppings" },
  { name: "Beef", slug: "beef", description: "Premium beef options" },
  { name: "Special", slug: "special", description: "Chef signature creations" },
];

const TOPPINGS = [
  { name: "Extra Cheese", price: 1.5 },
  { name: "Mushrooms", price: 1.0 },
  { name: "Jalapenos", price: 0.75 },
  { name: "Black Olives", price: 0.75 },
  { name: "Sun-dried Tomatoes", price: 1.25 },
  { name: "Red Onions", price: 0.5 },
  { name: "Bell Peppers", price: 0.75 },
  { name: "Bacon Bits", price: 1.5 },
];

const PIZZAS = [
  {
    name: "Margherita Classic",
    slug: "margherita-classic",
    description: "Our timeless classic — San Marzano tomato, fresh mozzarella, fragrant basil, and a drizzle of extra-virgin olive oil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
    basePrice: 12.99,
    smallPrice: 9.99,
    mediumPrice: 12.99,
    largePrice: 16.99,
    category: "vegetarian",
    ingredients: ["San Marzano Tomato", "Fresh Mozzarella", "Basil", "Olive Oil"],
    tags: ["classic", "vegetarian", "bestseller"],
    isFeatured: true,
  },
  {
    name: "BBQ Chicken Feast",
    slug: "bbq-chicken-feast",
    description: "Smoky BBQ sauce, grilled chicken strips, caramelized onions, cheddar and mozzarella blend.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    basePrice: 15.99,
    smallPrice: 12.99,
    mediumPrice: 15.99,
    largePrice: 19.99,
    category: "chicken",
    ingredients: ["BBQ Sauce", "Grilled Chicken", "Caramelized Onions", "Cheddar", "Mozzarella"],
    tags: ["chicken", "bbq", "bestseller"],
    isFeatured: true,
  },
  {
    name: "Spicy Beef Diablo",
    slug: "spicy-beef-diablo",
    description: "Fiery ground beef, ghost pepper sauce, fresh jalapeños, red onion, and smoked mozzarella.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
    basePrice: 16.99,
    smallPrice: 13.99,
    mediumPrice: 16.99,
    largePrice: 21.99,
    category: "beef",
    ingredients: ["Ground Beef", "Ghost Pepper Sauce", "Jalapeños", "Red Onion", "Smoked Mozzarella"],
    tags: ["beef", "spicy", "hot"],
    isFeatured: true,
  },
  {
    name: "Truffle Mushroom",
    slug: "truffle-mushroom",
    description: "White truffle oil, wild mushroom medley, fontina cheese, fresh thyme, and roasted garlic.",
    image: "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
    basePrice: 18.99,
    smallPrice: 14.99,
    mediumPrice: 18.99,
    largePrice: 23.99,
    category: "special",
    ingredients: ["Truffle Oil", "Wild Mushrooms", "Fontina Cheese", "Thyme", "Roasted Garlic"],
    tags: ["premium", "vegetarian", "special"],
    isFeatured: true,
  },
  {
    name: "Garden Veggie Supreme",
    slug: "garden-veggie-supreme",
    description: "A rainbow of fresh vegetables — bell peppers, zucchini, cherry tomatoes, spinach on herbed tomato base.",
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600&q=80",
    basePrice: 13.99,
    smallPrice: 10.99,
    mediumPrice: 13.99,
    largePrice: 17.99,
    category: "vegetarian",
    ingredients: ["Bell Peppers", "Zucchini", "Cherry Tomatoes", "Spinach", "Herbed Tomato"],
    tags: ["vegetarian", "healthy", "vegan-option"],
    isFeatured: false,
  },
  {
    name: "Chicken Tikka Masala",
    slug: "chicken-tikka-masala",
    description: "Indian-inspired tikka masala sauce, tandoori chicken, red onion, coriander, and cooling raita drizzle.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80",
    basePrice: 16.99,
    smallPrice: 13.99,
    mediumPrice: 16.99,
    largePrice: 20.99,
    category: "chicken",
    ingredients: ["Tikka Masala Sauce", "Tandoori Chicken", "Red Onion", "Coriander", "Raita"],
    tags: ["chicken", "fusion", "indian"],
    isFeatured: false,
  },
  {
    name: "Meat Lovers Overload",
    slug: "meat-lovers-overload",
    description: "A carnivore dream — pepperoni, beef, chicken, bacon, sausage on rich tomato sauce with double cheese.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    basePrice: 19.99,
    smallPrice: 15.99,
    mediumPrice: 19.99,
    largePrice: 24.99,
    category: "special",
    ingredients: ["Pepperoni", "Beef", "Chicken", "Bacon", "Sausage", "Double Cheese"],
    tags: ["meat", "indulgent", "premium"],
    isFeatured: false,
  },
  {
    name: "Pesto Chicken",
    slug: "pesto-chicken",
    description: "House-made basil pesto, grilled chicken breast, sun-dried tomatoes, pine nuts, and Parmesan shavings.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
    basePrice: 15.99,
    smallPrice: 12.99,
    mediumPrice: 15.99,
    largePrice: 19.99,
    category: "chicken",
    ingredients: ["Basil Pesto", "Grilled Chicken", "Sun-dried Tomatoes", "Pine Nuts", "Parmesan"],
    tags: ["chicken", "pesto", "italian"],
    isFeatured: false,
  },
];

async function main() {
  console.log("Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@pizzeria.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@pizzeria.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Regular user
  const userPassword = await bcrypt.hash("user123456", 12);
  await prisma.user.upsert({
    where: { email: "user@pizzeria.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@pizzeria.com",
      password: userPassword,
      role: "USER",
    },
  });

  // Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = c.id;
  }

  // Toppings
  for (const top of TOPPINGS) {
    await prisma.topping.upsert({
      where: { name: top.name },
      update: {},
      create: top,
    });
  }

  // Pizzas
  for (const pizza of PIZZAS) {
    const { category, ...pizzaData } = pizza;
    await prisma.pizza.upsert({
      where: { slug: pizzaData.slug },
      update: {},
      create: {
        ...pizzaData,
        categoryId: categoryMap[category],
        isAvailable: true,
      },
    });
  }

  // Coupons
  await prisma.coupon.upsert({
    where: { code: "PIZZA10" },
    update: {},
    create: { code: "PIZZA10", discount: 10, isPercent: true, maxUses: 100, isActive: true },
  });
  await prisma.coupon.upsert({
    where: { code: "COMBO15" },
    update: {},
    create: { code: "COMBO15", discount: 15, isPercent: true, maxUses: 50, isActive: true },
  });

  console.log("Seed complete!");
  console.log("Admin login: admin@pizzeria.com / admin123456");
  console.log("User login: user@pizzeria.com / user123456");
}

main().catch(console.error).finally(() => prisma.$disconnect());
