import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' },
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    invoiceNumber: { type: String, unique: true },
    notes: { type: String, default: '' },
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    if (!this.invoiceNumber) {
        this.invoiceNumber = 'ATF-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
