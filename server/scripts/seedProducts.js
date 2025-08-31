import mongoose from 'mongoose';
import Product from '../models/Product.js';
import moroccanProducts from '../data/moroccanProducts.js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة من ملف .env في الجذر
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedProducts = async () => {
  try {
    // الاتصال بقاعدة البيانات
    const uri = 'mongodb+srv://therz1:dVPtS5G5gdpaSIQV@cluster0.6vxmctl.mongodb.net/maroc-cart?retryWrites=true&w=majority';
    console.log('الاتصال بـ MongoDB Atlas...');
    await mongoose.connect(uri);

    console.log('تم الاتصال بقاعدة البيانات');

    // حذف المنتجات القديمة
    await Product.deleteMany({});
    console.log('تم حذف المنتجات القديمة');

    // إضافة المنتجات الجديدة
    const products = await Product.insertMany(moroccanProducts);
    console.log(`تم إضافة ${products.length} منتج بنجاح`);

    // عرض المنتجات المضافة
    products.forEach(product => {
      console.log(`- ${product.name} - ${product.price} درهم`);
    });

    process.exit(0);
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error);
    process.exit(1);
  }
};

seedProducts();
