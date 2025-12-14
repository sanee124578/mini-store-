import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/ProductModel.js";

dotenv.config();
const products = [
  // 🧥 CLOTHES (25)
  {
    name: "Men's Premium Leather Jacket",
    category: "Clothes",
    price: 4999,
    stock: 25,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "High-quality brown leather jacket for winter style.",
  },
  {
    name: "Women's Casual Denim Jacket",
    category: "Clothes",
    price: 2499,
    stock: 40,
    image: "https://images.unsplash.com/photo-1520974735194-7c0b0a48d4a9?w=800&q=80",
    description: "Trendy light-blue denim jacket with soft finish.",
  },
  {
    name: "Men's Formal Shirt - Sky Blue",
    category: "Clothes",
    price: 1299,
    stock: 100,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3b0c?w=800&q=80",
    description: "Slim-fit cotton shirt for formal and semi-formal use.",
  },
  {
    name: "Women's Floral Summer Dress",
    category: "Clothes",
    price: 1799,
    stock: 60,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    description: "Light and breezy floral dress for casual summer outings.",
  },
  {
    name: "Men's Sports Hoodie - Grey",
    category: "Clothes",
    price: 1499,
    stock: 50,
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=800&q=80",
    description: "Comfortable fleece hoodie perfect for workouts or leisure.",
  },
  {
    name: "Women's Winter Coat - Black",
    category: "Clothes",
    price: 2999,
    stock: 30,
    image: "https://images.unsplash.com/photo-1542060748-10c28b62716a?w=800&q=80",
    description: "Elegant winter coat with warm inner lining.",
  },
  {
    name: "Men's Polo T-Shirt - Navy Blue",
    category: "Clothes",
    price: 899,
    stock: 120,
    image: "https://images.unsplash.com/photo-1618354690766-1e50f11224fc?w=800&q=80",
    description: "Cotton-blend polo t-shirt with a soft touch finish.",
  },
  {
    name: "Women's Classic Saree - Red Silk",
    category: "Clothes",
    price: 3499,
    stock: 45,
    image: "https://images.unsplash.com/photo-1610010377779-bf356aff72c6?w=800&q=80",
    description: "Traditional silk saree with intricate border design.",
  },
  {
    name: "Men's Cargo Pants - Olive Green",
    category: "Clothes",
    price: 1599,
    stock: 75,
    image: "https://images.unsplash.com/photo-1618354690766-1e50f11224fc?w=800&q=80",
    description: "Tough and stylish cargo pants for everyday use.",
  },
  {
    name: "Women's Activewear Set - Black",
    category: "Clothes",
    price: 2499,
    stock: 65,
    image: "https://images.unsplash.com/photo-1616469829935-0b4f0c4311de?w=800&q=80",
    description: "Premium yoga and workout set for fitness enthusiasts.",
  },

  // 👟 FOOTWEAR (25)
  {
    name: "Nike Air Zoom Pegasus",
    category: "Footwear",
    price: 6999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    description: "Lightweight running shoes with premium cushioning.",
  },
  {
    name: "Adidas Ultraboost 22",
    category: "Footwear",
    price: 8999,
    stock: 25,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    description: "Responsive running shoes with energy return technology.",
  },
  {
    name: "Women's High Heel Sandals",
    category: "Footwear",
    price: 2499,
    stock: 30,
    image: "https://images.unsplash.com/photo-1507682226856-9603c9d3b91d?w=800&q=80",
    description: "Elegant high heel sandals for party and casual wear.",
  },
  {
    name: "Men's Leather Formal Shoes",
    category: "Footwear",
    price: 3499,
    stock: 45,
    image: "https://images.unsplash.com/photo-1606813902916-e7d5b94a8e95?w=800&q=80",
    description: "Polished formal shoes for professional attire.",
  },
  {
    name: "Puma Sports Shoes",
    category: "Footwear",
    price: 5999,
    stock: 50,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    description: "Perfect blend of comfort and performance.",
  },
  {
    name: "Casual Slip-on Sneakers",
    category: "Footwear",
    price: 1999,
    stock: 70,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    description: "Stylish everyday sneakers with breathable design.",
  },
  {
    name: "Women's Ballet Flats",
    category: "Footwear",
    price: 1599,
    stock: 80,
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
    description: "Comfortable and elegant flats for office or casual wear.",
  },
  {
    name: "Men’s Flip Flops",
    category: "Footwear",
    price: 799,
    stock: 90,
    image: "https://images.unsplash.com/photo-1528701800489-20beeb0ab607?w=800&q=80",
    description: "Durable rubber flip flops perfect for beach days.",
  },
  {
    name: "Kids Sport Shoes",
    category: "Footwear",
    price: 1799,
    stock: 50,
    image: "https://images.unsplash.com/photo-1600181957760-6f47f59bdf96?w=800&q=80",
    description: "Colorful and comfy shoes designed for kids.",
  },
  {
    name: "Women's Boots - Tan Leather",
    category: "Footwear",
    price: 3999,
    stock: 30,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
    description: "Premium leather boots for fashion-forward comfort.",
  },

  // 💻 ELECTRONICS (25)
  {
    name: "Apple iPhone 15 Pro Max",
    category: "Electronics",
    price: 139999,
    stock: 10,
    image: "https://images.unsplash.com/photo-1603898037225-1ff1e49edc9c?w=800&q=80",
    description: "Flagship smartphone with A17 Pro chip and titanium body.",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    price: 119999,
    stock: 15,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description: "Premium smartphone with dynamic AMOLED display.",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    price: 29999,
    stock: 25,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    description: "Industry-leading noise cancellation headphones.",
  },
  {
    name: "Apple MacBook Air M3",
    category: "Electronics",
    price: 134999,
    stock: 12,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    description: "Super thin and powerful laptop for professionals.",
  },
  {
    name: "OnePlus 12R 5G",
    category: "Electronics",
    price: 49999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    description: "Flagship killer smartphone with Snapdragon 8 Gen 2.",
  },
  {
    name: "Samsung 4K Smart TV 55-inch",
    category: "Electronics",
    price: 64999,
    stock: 18,
    image: "https://images.unsplash.com/photo-1581092334485-1c7c3a50b9b5?w=800&q=80",
    description: "Ultra HD Smart TV with vibrant colors and apps.",
  },
  {
    name: "Apple Watch Series 9",
    category: "Electronics",
    price: 41999,
    stock: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "The ultimate fitness and health companion watch.",
  },
  {
    name: "JBL Partybox 310 Speaker",
    category: "Electronics",
    price: 35999,
    stock: 22,
    image: "https://images.unsplash.com/photo-1581093588401-22e6b5071b3b?w=800&q=80",
    description: "Powerful Bluetooth speaker with deep bass.",
  },
];
// 🥦 GROCERY (30)
products.push(
  {
    name: "Organic Almonds 500g",
    category: "Grocery",
    price: 799,
    stock: 120,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2a?w=800&q=80",
    description: "High-quality raw almonds packed with natural nutrients.",
  },
  {
    name: "Arabica Coffee Beans 1kg",
    category: "Grocery",
    price: 1199,
    stock: 90,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    description: "Freshly roasted Arabica beans for premium coffee experience.",
  },
  {
    name: "Organic Brown Rice 5kg",
    category: "Grocery",
    price: 699,
    stock: 150,
    image: "https://images.unsplash.com/photo-1611078489935-3250b0e32f68?w=800&q=80",
    description: "Healthy, gluten-free brown rice for everyday meals.",
  },
  {
    name: "Natural Honey Jar 1kg",
    category: "Grocery",
    price: 499,
    stock: 80,
    image: "https://images.unsplash.com/photo-1608451643047-46d6d41d3b8d?w=800&q=80",
    description: "Pure organic honey from Himalayan farms.",
  },
  {
    name: "Extra Virgin Olive Oil 1L",
    category: "Grocery",
    price: 899,
    stock: 60,
    image: "https://images.unsplash.com/photo-1622554058141-56f4a4e63029?w=800&q=80",
    description: "Cold-pressed olive oil ideal for cooking and salads.",
  },
  {
    name: "Oats - Instant Breakfast Pack 1kg",
    category: "Grocery",
    price: 299,
    stock: 200,
    image: "https://images.unsplash.com/photo-1606756790138-02fa0b4bbf47?w=800&q=80",
    description: "Nutritious and fiber-rich instant breakfast oats.",
  },
  {
    name: "Whole Wheat Atta 10kg",
    category: "Grocery",
    price: 499,
    stock: 300,
    image: "https://images.unsplash.com/photo-1590080875832-4e3f941e502d?w=800&q=80",
    description: "Finely milled high-quality wheat flour.",
  },
  {
    name: "Premium Cashews 500g",
    category: "Grocery",
    price: 899,
    stock: 120,
    image: "https://images.unsplash.com/photo-1590080875832-4e3f941e502d?w=800&q=80",
    description: "Crunchy cashews, perfect for snacks and desserts.",
  }
);

// 💪 FITNESS (25)
products.push(
  {
    name: "Adjustable Dumbbell Set 20kg",
    category: "Fitness",
    price: 3499,
    stock: 40,
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07f?w=800&q=80",
    description: "Durable dumbbells with adjustable plates for strength training.",
  },
  {
    name: "Yoga Mat - Non Slip",
    category: "Fitness",
    price: 999,
    stock: 100,
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800&q=80",
    description: "High-density yoga mat for comfort and grip.",
  },
  {
    name: "Resistance Band Set",
    category: "Fitness",
    price: 699,
    stock: 80,
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80",
    description: "5-level resistance bands for workout flexibility.",
  },
  {
    name: "Smart Fitness Watch",
    category: "Fitness",
    price: 3999,
    stock: 50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Track your heart rate, steps, and workouts efficiently.",
  },
  {
    name: "Protein Shaker Bottle 700ml",
    category: "Fitness",
    price: 299,
    stock: 150,
    image: "https://images.unsplash.com/photo-1600181957760-6f47f59bdf96?w=800&q=80",
    description: "Leakproof shaker with mixing ball, perfect for gym use.",
  }
);

// 💅 BEAUTY (20)
products.push(
  {
    name: "Matte Lipstick Set (6 Shades)",
    category: "Beauty",
    price: 999,
    stock: 70,
    image: "https://images.unsplash.com/photo-1616712134411-b3e1a83b2b1b?w=800&q=80",
    description: "Long-lasting matte lipstick in 6 vibrant shades.",
  },
  {
    name: "Vitamin C Face Serum",
    category: "Beauty",
    price: 699,
    stock: 100,
    image: "https://images.unsplash.com/photo-1619715766859-efb39a65e0ea?w=800&q=80",
    description: "Brightens skin and reduces pigmentation effectively.",
  },
  {
    name: "Keratin Hair Mask 500ml",
    category: "Beauty",
    price: 899,
    stock: 60,
    image: "https://images.unsplash.com/photo-1626899798511-9c5e844ac25f?w=800&q=80",
    description: "Deep-conditioning keratin mask for shiny, smooth hair.",
  },
  {
    name: "Organic Aloe Vera Gel 250ml",
    category: "Beauty",
    price: 349,
    stock: 150,
    image: "https://images.unsplash.com/photo-1629718444645-5a908f52f7ec?w=800&q=80",
    description: "Multi-purpose soothing aloe vera for face and hair.",
  },
  {
    name: "Charcoal Face Wash",
    category: "Beauty",
    price: 299,
    stock: 120,
    image: "https://images.unsplash.com/photo-1612817159949-3d5e1c5f9c03?w=800&q=80",
    description: "Deep cleans pores, removes oil and dirt effectively.",
  }
);

// 🏠 HOME DECOR (25)
products.push(
  {
    name: "Luxury Table Lamp - Gold",
    category: "Home Decor",
    price: 2499,
    stock: 50,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6f7?w=800&q=80",
    description: "Elegant golden lamp for premium room decor.",
  },
  {
    name: "Abstract Wall Painting Set",
    category: "Home Decor",
    price: 2999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    description: "Set of 3 abstract art prints for modern homes.",
  },
  {
    name: "Ceramic Flower Vase",
    category: "Home Decor",
    price: 899,
    stock: 80,
    image: "https://images.unsplash.com/photo-1589739906089-53a8ef4b16a7?w=800&q=80",
    description: "Premium handcrafted vase with glossy finish.",
  },
  {
    name: "Velvet Cushion Cover (Set of 4)",
    category: "Home Decor",
    price: 1299,
    stock: 100,
    image: "https://images.unsplash.com/photo-1598300054045-999c82ad6b27?w=800&q=80",
    description: "Soft velvet covers that elevate your living room decor.",
  },
  {
    name: "Scented Candles (Pack of 3)",
    category: "Home Decor",
    price: 999,
    stock: 70,
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c91?w=800&q=80",
    description: "Premium scented candles for cozy home ambience.",
  }
);

// ⌚ ACCESSORIES (30)
products.push(
  {
    name: "Men's Aviator Sunglasses",
    category: "Accessories",
    price: 1499,
    stock: 80,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&q=80",
    description: "Classic aviator-style shades for men with UV protection.",
  },
  {
    name: "Women's Diamond Watch",
    category: "Accessories",
    price: 4999,
    stock: 30,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "Stylish wristwatch with premium metallic finish.",
  },
  {
    name: "Leather Wallet for Men",
    category: "Accessories",
    price: 999,
    stock: 120,
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80",
    description: "Handcrafted genuine leather wallet with 6 card slots.",
  },
  {
    name: "Smart Sunglasses with Bluetooth",
    category: "Accessories",
    price: 3999,
    stock: 40,
    image: "https://images.unsplash.com/photo-1606813902916-e7d5b94a8e95?w=800&q=80",
    description: "Connects to phone with in-built mic and speakers.",
  },
  {
    name: "Gold Plated Necklace Set",
    category: "Accessories",
    price: 2799,
    stock: 60,
    image: "https://images.unsplash.com/photo-1603565816034-6b9b8d4a9ccf?w=800&q=80",
    description: "Elegant traditional necklace set with premium polish.",
  }
);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany();
    console.log("🗑️ Old products deleted");

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully!`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
