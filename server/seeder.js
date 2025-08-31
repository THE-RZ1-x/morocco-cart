import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import mongoose from 'mongoose';
import Product from './models/Product.js';

// Moroccan products with correct categories and unique images
const products = [
  {
    name: 'Traditional Moroccan Tajine',
    description: 'طاجين مغربي تقليدي من السيراميك المصنوع يدوياً، مثالي للطبخ البطيء والنكهات الأصيلة',
    price: 45,
    priceMAD: 450,
    image: '/images/tajine.avif',
    images: ['/images/tajine.avif'],
    category: 'Home & Kitchen',
    brand: 'Artisanat Marocain',
    countInStock: 25,
    rating: 4.7,
    numReviews: 18,
    isActive: true,
    tags: ['طاجين', 'مطبخ', 'تقليدي', 'سيراميك', 'مغربي'],
    specifications: new Map([
      ['المادة', 'سيراميك مصنوع يدوياً'],
      ['الحجم', '30 سم قطر'],
      ['الاستخدام', 'طبخ بطيء وتقديم'],
      ['المنشأ', 'سلا، المغرب'],
      ['العناية', 'غسيل يدوي']
    ])
  },
  {
    name: 'Pure Moroccan Argan Oil',
    description: 'زيت الأركان المغربي الأصلي 100% طبيعي ونقي، مستخرج من لوز الأركان المغربي للعناية بالبشرة والشعر',
    price: 35,
    priceMAD: 350,
    image: '/images/argan-oil.avif',
    images: ['/images/argan-oil.avif'],
    category: 'Electronics',
    brand: 'Argan du Maroc',
    countInStock: 40,
    rating: 4.9,
    numReviews: 45,
    isActive: true,
    tags: ['أركان', 'زيت', 'طبيعي', 'تجميل', 'مغربي', 'عضوي'],
    specifications: new Map([
      ['النوع', '100% زيت أركان نقي'],
      ['الحجم', '50 مل'],
      ['الاستخدام', 'البشرة والشعر'],
      ['المنشأ', 'أكادير، المغرب'],
      ['الاستخراج', 'عصر بارد تقليدي']
    ])
  },
  {
    name: 'Moroccan Leather Babouches',
    description: 'بلغة مغربية تقليدية مصنوعة من الجلد الطبيعي المدبوغ يدوياً، مريحة وأنيقة للاستخدام اليومي',
    price: 28,
    priceMAD: 280,
    image: '/images/babouches.avif',
    images: ['/images/babouches.avif'],
    category: 'Clothing',
    brand: 'Cuir de Fès',
    countInStock: 30,
    rating: 4.5,
    numReviews: 22,
    isActive: true,
    tags: ['بلغة', 'جلد', 'تقليدي', 'مريح', 'مغربي'],
    specifications: new Map([
      ['المادة', 'جلد طبيعي مدبوغ'],
      ['المقاسات', '36-45'],
      ['اللون', 'بني طبيعي'],
      ['المنشأ', 'فاس، المغرب'],
      ['الصناعة', 'يدوية تقليدية']
    ])
  },
  {
    name: 'Moroccan Tea Pot',
    description: 'إبريق شاي مغربي تقليدي من النحاس المطلي بالفضة، مثالي لتحضير الأتاي المغربي الأصيل',
    price: 65,
    priceMAD: 650,
    image: '/images/theiere.avif',
    images: ['/images/theiere.avif'],
    category: 'Home & Kitchen',
    brand: 'Artisanat Marocain',
    countInStock: 15,
    rating: 4.8,
    numReviews: 12,
    isActive: true,
    tags: ['إبريق', 'شاي', 'نحاس', 'تقليدي', 'أتاي'],
    specifications: new Map([
      ['المادة', 'نحاس مطلي بالفضة'],
      ['السعة', '1.2 لتر'],
      ['الاستخدام', 'تحضير الشاي المغربي'],
      ['المنشأ', 'تطوان، المغرب'],
      ['التصميم', 'نقوش تقليدية يدوية']
    ])
  },
  {
    name: 'Moroccan Metal Lantern',
    description: 'فانوس مغربي تقليدي من المعدن المنقوش يدوياً، يضفي أجواء شرقية ساحرة على المكان',
    price: 55,
    priceMAD: 550,
    image: '/images/lanterne.webp',
    images: ['/images/lanterne.webp'],
    category: 'Electronics',
    brand: 'Artisanat Marocain',
    countInStock: 20,
    rating: 4.6,
    numReviews: 15,
    isActive: true,
    tags: ['فانوس', 'إضاءة', 'معدن', 'ديكور', 'تقليدي'],
    specifications: new Map([
      ['المادة', 'معدن منقوش يدوياً'],
      ['الارتفاع', '35 سم'],
      ['الاستخدام', 'إضاءة ديكورية'],
      ['المنشأ', 'مراكش، المغرب'],
      ['النقوش', 'هندسية إسلامية تقليدية']
    ])
  },
  {
    name: 'Handwoven Berber Carpet',
    description: 'سجادة بربرية أصيلة منسوجة يدوياً من الصوف الطبيعي، بألوان وأنماط تقليدية أمازيغية',
    price: 180,
    priceMAD: 1800,
    image: '/images/tapis.avif',
    images: ['/images/tapis.avif'],
    category: 'Home & Kitchen',
    brand: 'Tapis Berbère',
    countInStock: 8,
    rating: 4.9,
    numReviews: 8,
    isActive: true,
    tags: ['سجادة', 'بربرية', 'صوف', 'يدوي', 'أمازيغي'],
    specifications: new Map([
      ['المادة', 'صوف طبيعي 100%'],
      ['الحجم', '200x150 سم'],
      ['النسج', 'يدوي تقليدي'],
      ['المنشأ', 'الأطلس المتوسط، المغرب'],
      ['الألوان', 'طبيعية تقليدية']
    ])
  },
  // Additional products with variations but using same images
  {
    name: 'Large Family Tajine',
    description: 'طاجين كبير للعائلة، مصنوع من أجود أنواع الطين المغربي، يتسع لـ 8 أشخاص',
    price: 75,
    priceMAD: 750,
    image: '/images/tajine.avif',
    images: ['/images/tajine.avif'],
    category: 'Home & Kitchen',
    brand: 'Artisanat Marocain',
    countInStock: 12,
    rating: 4.8,
    numReviews: 10,
    isActive: true,
    tags: ['طاجين', 'عائلي', 'كبير', 'طين', 'مغربي'],
    specifications: new Map([
      ['المادة', 'طين مغربي أصيل'],
      ['الحجم', '40 سم قطر'],
      ['السعة', '8 أشخاص'],
      ['المنشأ', 'سلا، المغرب'],
      ['الوزن', '3.5 كيلو']
    ])
  },
  {
    name: 'Culinary Argan Oil',
    description: 'زيت الأركان الغذائي المحمص، نكهة مميزة للسلطات والأطباق المغربية التقليدية',
    price: 42,
    priceMAD: 420,
    image: '/images/argan-oil.avif',
    images: ['/images/argan-oil.avif'],
    category: 'Books',
    brand: 'Argan du Maroc',
    countInStock: 25,
    rating: 4.7,
    numReviews: 16,
    isActive: true,
    tags: ['أركان', 'طبخ', 'غذائي', 'محمص', 'سلطة'],
    specifications: new Map([
      ['النوع', 'زيت أركان غذائي محمص'],
      ['الحجم', '250 مل'],
      ['الاستخدام', 'الطبخ والسلطات'],
      ['المنشأ', 'أكادير، المغرب'],
      ['النكهة', 'جوزية مميزة']
    ])
  },
  {
    name: 'Embroidered Babouches',
    description: 'بلغة نسائية أنيقة مطرزة بخيوط ملونة، مثالية للمناسبات الخاصة',
    price: 45,
    priceMAD: 450,
    image: '/images/babouches.avif',
    images: ['/images/babouches.avif'],
    category: 'Clothing',
    brand: 'Cuir de Fès',
    countInStock: 18,
    rating: 4.6,
    numReviews: 14,
    isActive: true,
    tags: ['بلغة', 'نسائي', 'مطرز', 'أنيق', 'مناسبات'],
    specifications: new Map([
      ['المادة', 'جلد مطرز بخيوط حريرية'],
      ['المقاسات', '36-42'],
      ['الألوان', 'أحمر، أزرق، ذهبي'],
      ['المنشأ', 'فاس، المغرب'],
      ['التطريز', 'يدوي تقليدي']
    ])
  },
  {
    name: 'Small Tea Pot for Guests',
    description: 'إبريق شاي مغربي صغير مثالي لتقديم الشاي للضيوف، تصميم أنيق ومميز',
    price: 38,
    priceMAD: 380,
    image: '/images/theiere.avif',
    images: ['/images/theiere.avif'],
    category: 'Sports',
    brand: 'Artisanat Marocain',
    countInStock: 22,
    rating: 4.5,
    numReviews: 11,
    isActive: true,
    tags: ['إبريق', 'صغير', 'ضيوف', 'أنيق', 'شاي'],
    specifications: new Map([
      ['المادة', 'نحاس منقوش'],
      ['السعة', '0.8 لتر'],
      ['الاستخدام', 'تقديم الشاي للضيوف'],
      ['المنشأ', 'تطوان، المغرب'],
      ['الحجم', 'صغير ومناسب']
    ])
  },
  {
    name: 'Large Garden Lantern',
    description: 'فانوس مغربي كبير مقاوم للطقس، مثالي للحدائق والمساحات الخارجية',
    price: 95,
    priceMAD: 950,
    image: '/images/lanterne.webp',
    images: ['/images/lanterne.webp'],
    category: 'Electronics',
    brand: 'Artisanat Marocain',
    countInStock: 10,
    rating: 4.8,
    numReviews: 7,
    isActive: true,
    tags: ['فانوس', 'كبير', 'حديقة', 'خارجي', 'مقاوم'],
    specifications: new Map([
      ['المادة', 'معدن مقاوم للصدأ'],
      ['الارتفاع', '50 سم'],
      ['الاستخدام', 'إضاءة خارجية'],
      ['المقاومة', 'ضد الطقس والرطوبة'],
      ['التركيب', 'سهل التعليق']
    ])
  },
  {
    name: 'Small Entry Carpet',
    description: 'سجادة بربرية صغيرة مثالية للمداخل والممرات، نسج يدوي بألوان زاهية',
    price: 120,
    priceMAD: 1200,
    image: '/images/tapis.avif',
    images: ['/images/tapis.avif'],
    category: 'Home & Kitchen',
    brand: 'Tapis Berbère',
    countInStock: 15,
    rating: 4.7,
    numReviews: 9,
    isActive: true,
    tags: ['سجادة', 'صغيرة', 'مدخل', 'زاهية', 'بربرية'],
    specifications: new Map([
      ['المادة', 'صوف وقطن مخلوط'],
      ['الحجم', '120x80 سم'],
      ['النسج', 'يدوي تقليدي'],
      ['المنشأ', 'الأطلس المتوسط، المغرب'],
      ['الاستخدام', 'مداخل وممرات']
    ])
  }
];

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI_MARKET;
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}