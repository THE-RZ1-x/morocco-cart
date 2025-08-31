import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        priceMAD: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: false },
      country: { type: String, required: true, default: 'Morocco' },
      phone: { type: String, required: true },
      alternativePhone: { type: String },
      landmark: { type: String }, // Moroccan addresses often use landmarks
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card', 'paypal', 'cashplus', 'bank_transfer', 'wafa_cash'],
      default: 'cod'
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
      transaction_id: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    itemsPriceMAD: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPriceMAD: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    trackingNumber: {
      type: String,
    },
    estimatedDelivery: {
      type: Date,
    },
    notes: {
      type: String,
    },
    customerNotes: {
      type: String,
    },
    // For Cash on Delivery
    codAmount: {
      type: Number,
      default: 0,
    },
    // Delivery attempts for COD orders
    deliveryAttempts: [{
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ['attempted', 'failed', 'rescheduled'] },
      notes: { type: String }
    }],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
