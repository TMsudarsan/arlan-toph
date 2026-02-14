import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Party Wear', 'Ethnic Wear', 'Casual Wear', 'Bridal Collections'],
    },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    wholesalePrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    moq: { type: Number, required: true, default: 10 },
    bulkPricingTiers: [{
        minQty: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    stock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    fabric: { type: String, default: '' },
    style: { type: String, default: '' },
    occasion: { type: String, default: '' },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
