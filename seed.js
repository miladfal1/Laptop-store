const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// مدل‌ها را وارد می‌کنیم
const User = require("./src/models/user.model");
const Category = require("./src/models/category.model");
const Item = require("./src/models/item.model");

// اتصال به دیتابیس MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/security", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

// ساخت یک کاربر ادمین
const seedAdminUser = async () => {
  const adminUser = new User({
    username: "09213047355",
    password: 123456,
    role: "admin",
  });
  await adminUser.save();
  console.log("Admin user created");
};

// ساخت دسته‌بندی‌ها
const categories = [
  { name: "لپ تاپ گیمینگ", img: "/uploads/gaming.jpg" },
  { name: "لپ تاپ کاری", img: "/uploads/bus.png" },
  { name: "لپ تاپ دانشجویی", img: "/uploads/laptop.png" },
  { name: "مکبوک", img: "/uploads/mac.jpg" },
  { name: "اولترا بوک", img: "/uploads/ultrabook" },
];

const seedCategories = async () => {
  for (const category of categories) {
    const newCategory = new Category({
      name: category.name,
      img: category.img,
    });
    await newCategory.save();
  }
  console.log("Categories created");
};

// ساخت آیتم‌های لپ تاپ
const laptops = [
  {
    name: "Asus ROG Zephyrus G14",
    price: 2000,
    category: "لپ تاپ گیمینگ",
    discountPrice: 1800,
    img: "/uploads/hp.png",
  },
  {
    name: "Acer Predator Helios 300",
    price: 1500,
    category: "لپ تاپ گیمینگ",
    img: "/uploads/hp.png",
  },
  {
    name: "Dell XPS 13",
    price: 1800,
    category: "لپ تاپ کاری",
    discountPrice: 1700,
    img: "/uploads/hp.png",
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    price: 2200,
    category: "لپ تاپ کاری",
    img: "/uploads/hp.png",
  },
  {
    name: "MacBook Pro M1",
    price: 2500,
    category: "مکبوک",
    discountPrice: 2400,
    img: "/uploads/macbook.jpg",
  },
  {
    name: "MacBook Air M2",
    price: 2000,
    category: "مکبوک",
    img: "/uploads/macbook.jpg",
  },
  {
    name: "Acer Swift 3",
    price: 1200,
    category: "اولترا بوک",
    discountPrice: 1100,
    img: "/uploads/hp.png",
  },
  {
    name: "HP Spectre x360",
    price: 1900,
    category: "اولترا بوک",
    img: "/uploads/hp.png",
  },
  {
    name: "Asus VivoBook 15",
    price: 900,
    category: "لپ تاپ دانشجویی",
    discountPrice: 850,
    img: "/uploads/hp.png",
  },
  {
    name: "Lenovo IdeaPad 3",
    price: 800,
    category: "لپ تاپ دانشجویی",
    img: "/uploads/hp.png",
  },
  {
    name: "Lenovo IdeaPad 3",
    price: 100,
    category: "لپ تاپ دانشجویی",
    img: "/uploads/hp.png",
  },
  {
    name: "Lenovo IdeaPad 3",
    price: 200,
    category: "لپ تاپ دانشجویی",
    img: "/uploads/hp.png",
  },
  {
    name: "Lenovo IdeaPad 3",
    price: 400,
    category: "لپ تاپ دانشجویی",
    img: "/uploads/hp.png",
  },
];

const seedLaptops = async () => {
  for (const laptop of laptops) {
    const newLaptop = new Item({
      name: laptop.name,
      price: laptop.price,
      category: laptop.category,
      discountPrice: laptop.discountPrice || null,
      img: laptop.img,
    });
    await newLaptop.save();
  }
  console.log("Laptops created");
};

// اجرای تمام seedها
const seedDatabase = async () => {
  await seedAdminUser();
  await seedCategories();
  await seedLaptops();
  mongoose.connection.close();
};

seedDatabase();
