import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin
    const admin = await User.create({
        name: 'Admin',
        email: 'admin@arlantoph.com',
        password: 'admin123',
        phone: '9876543210',
        role: 'admin',
        isApproved: true,
        company: 'Arlan Toph Forth',
    });

    // Create sample buyer
    await User.create({
        name: 'Priya Sharma',
        email: 'buyer@test.com',
        password: 'buyer123',
        phone: '9876543211',
        role: 'buyer',
        isApproved: true,
        company: 'Priya Fashion House',
        gstin: '27AABCU9603R1ZM',
        address: {
            street: '45 Fashion Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
        },
    });

    // Create products
    const products = [
        {
            name: 'Royal Silk Anarkali Suit',
            description: 'Exquisite hand-embroidered silk anarkali suit with intricate zari work. Perfect for weddings and festive occasions. Premium quality silk fabric with detailed craftsmanship.',
            category: 'Ethnic Wear',
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Red', 'Maroon', 'Gold'],
            wholesalePrice: 850,
            mrp: 2499,
            moq: 10,
            bulkPricingTiers: [
                { minQty: 25, price: 780 },
                { minQty: 50, price: 720 },
                { minQty: 100, price: 650 },
            ],
            stock: 500,
            fabric: 'Pure Silk',
            occasion: 'Wedding',
        },
        {
            name: 'Sequin Party Gown',
            description: 'Stunning sequin-embellished party gown with a flowing silhouette. Features a sweetheart neckline and layered tulle skirt. Ideal for evening parties and celebrations.',
            category: 'Party Wear',
            images: [
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy Blue', 'Wine'],
            wholesalePrice: 680,
            mrp: 1999,
            moq: 15,
            bulkPricingTiers: [
                { minQty: 30, price: 620 },
                { minQty: 60, price: 560 },
                { minQty: 100, price: 500 },
            ],
            stock: 800,
            fabric: 'Georgette',
            occasion: 'Party',
        },
        {
            name: 'Cotton Floral Kurti Set',
            description: 'Comfortable cotton kurti with matching palazzo pants. Beautiful floral print in vibrant colors. Perfect for daily wear with a touch of elegance.',
            category: 'Casual Wear',
            images: [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
                'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
            colors: ['Pink', 'Yellow', 'Blue', 'Green'],
            wholesalePrice: 320,
            mrp: 999,
            moq: 20,
            bulkPricingTiers: [
                { minQty: 50, price: 280 },
                { minQty: 100, price: 250 },
                { minQty: 200, price: 220 },
            ],
            stock: 2000,
            fabric: 'Cotton',
            occasion: 'Casual',
        },
        {
            name: 'Designer Bridal Lehenga',
            description: 'Magnificent bridal lehenga with heavy embroidery and stone work. Features a designer blouse and dupatta set. Premium quality fabric for the perfect bridal look.',
            category: 'Bridal Collections',
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Red', 'Pink', 'Peach'],
            wholesalePrice: 2200,
            mrp: 7999,
            moq: 5,
            bulkPricingTiers: [
                { minQty: 10, price: 2000 },
                { minQty: 25, price: 1800 },
                { minQty: 50, price: 1600 },
            ],
            stock: 150,
            fabric: 'Velvet & Net',
            occasion: 'Wedding',
        },
        {
            name: 'Chiffon Saree Collection',
            description: 'Elegant chiffon saree with delicate border work. Lightweight and easy to drape. Available in multiple vibrant colors for every occasion.',
            category: 'Ethnic Wear',
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
            ],
            sizes: ['Free Size'],
            colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
            wholesalePrice: 420,
            mrp: 1499,
            moq: 20,
            bulkPricingTiers: [
                { minQty: 50, price: 380 },
                { minQty: 100, price: 340 },
                { minQty: 200, price: 300 },
            ],
            stock: 1000,
            fabric: 'Chiffon',
            occasion: 'Festive',
        },
        {
            name: 'Velvet Evening Dress',
            description: 'Luxurious velvet evening dress with a body-hugging fit. Features an elegant V-neckline with subtle embellishments. Perfect for cocktail parties.',
            category: 'Party Wear',
            images: [
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Emerald', 'Burgundy', 'Midnight Blue'],
            wholesalePrice: 750,
            mrp: 2299,
            moq: 10,
            bulkPricingTiers: [
                { minQty: 25, price: 690 },
                { minQty: 50, price: 630 },
                { minQty: 100, price: 570 },
            ],
            stock: 400,
            fabric: 'Velvet',
            occasion: 'Party',
        },
        {
            name: 'Printed Maxi Dress',
            description: 'Trendy printed maxi dress with a flattering A-line cut. Comfortable and stylish for everyday wear. Breathable fabric perfect for summer.',
            category: 'Casual Wear',
            images: [
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
                'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Floral Multi', 'Tropical', 'Abstract'],
            wholesalePrice: 380,
            mrp: 1199,
            moq: 20,
            bulkPricingTiers: [
                { minQty: 50, price: 340 },
                { minQty: 100, price: 300 },
                { minQty: 200, price: 260 },
            ],
            stock: 1500,
            fabric: 'Rayon',
            occasion: 'Casual',
        },
        {
            name: 'Heavy Embroidered Sharara Set',
            description: 'Beautiful sharara set with heavy thread embroidery. Includes kurta, sharara, and dupatta. Perfect for engagement and mehendi ceremonies.',
            category: 'Bridal Collections',
            images: [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Pastel Pink', 'Mint Green', 'Lavender'],
            wholesalePrice: 1800,
            mrp: 5999,
            moq: 5,
            bulkPricingTiers: [
                { minQty: 10, price: 1650 },
                { minQty: 25, price: 1500 },
                { minQty: 50, price: 1350 },
            ],
            stock: 200,
            fabric: 'Georgette',
            occasion: 'Wedding',
        },
    ];

    await Product.insertMany(products);
    console.log('✅ Seed data inserted successfully!');
    console.log(`Admin: admin@arlantoph.com / admin123`);
    console.log(`Buyer: buyer@test.com / buyer123`);
    process.exit();
};

seedData().catch((err) => {
    console.error(err);
    process.exit(1);
});
