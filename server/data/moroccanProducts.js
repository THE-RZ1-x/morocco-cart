const moroccanProducts = [
  {
    name: "زيت الأركان الأصلي",
    nameEn: "Pure Argan Oil",
    description: "زيت الأركان المغربي الأصلي 100%، غني بفيتامين E ومضادات الأكسدة، مثالي للعناية بالبشرة والشعر. يتم استخراجه بطريقة تقليدية من حبات شجرة الأركان في جنوب المغرب.",
    descriptionEn: "100% pure Moroccan argan oil, rich in vitamin E and antioxidants, perfect for skin and hair care. Traditionally extracted from argan tree nuts in southern Morocco.",
    price: 180,
    priceMAD: 180,
    category: "منتجات تجميل طبيعية",
    categoryEn: "Natural Beauty Products",
    image: "/images/argan-oil.avif",
    stock: 50,
    rating: 4.8,
    numReviews: 124,
    brand: "منتجات صحراوية",
    tags: ["زيت", "أركان", "طبيعي", "تجميل", "مغربي"],
    features: [
      "100% طبيعي بدون إضافات",
      "غني بفيتامين E",
      "مناسب لجميع أنواع البشرة",
      "تعبئة يدوية"
    ]
  },
  {
    name: "بابوش مغربي تقليدي",
    nameEn: "Traditional Moroccan Babouches",
    description: "بابوش مغربي صناعة يدوية من أجود أنواع الجلد، يتميز بتطريزه التقليدي وألوانه الزاهية. مريح للقدمين ومناسب للمناسبات والاستخدام اليومي.",
    descriptionEn: "Handcrafted Moroccan babouches made from premium leather, featuring traditional embroidery and vibrant colors. Comfortable for feet and suitable for occasions and daily use.",
    price: 220,
    priceMAD: 220,
    category: "أحذية تقليدية",
    categoryEn: "Traditional Footwear",
    image: "/images/babouches.avif",
    stock: 35,
    rating: 4.6,
    numReviews: 89,
    brand: "صناعة يدوية فاس",
    tags: ["بابوش", "جلد", "تقليدي", "يدوي", "مغربي"],
    features: [
      "جلد طبيعي عالي الجودة",
      "تطريز يدوي تقليدي",
      "مريح للقدمين",
      "ألوان متعددة"
    ]
  },
  {
    name: "فانوس معدني مغربي",
    nameEn: "Moroccan Metal Lantern",
    description: "فانوس معدني مغربي تقليدي مصنوع يدوياً من النحاس المزخرف، يضفي جواً شرقياً ساحراً على أي مكان. مثالي للديكور المنزلي والهدايا التذكارية.",
    descriptionEn: "Traditional Moroccan metal lantern handcrafted from decorated brass, creating an enchanting oriental atmosphere. Perfect for home decor and souvenir gifts.",
    price: 350,
    priceMAD: 350,
    category: "ديكور منزلي",
    categoryEn: "Home Decor",
    image: "/images/lanterne.webp",
    stock: 25,
    rating: 4.7,
    numReviews: 67,
    brand: "حرفيون مراكش",
    tags: ["فانوس", "نحاس", "ديكور", "تقليدي", "شرقي"],
    features: [
      "نحاس أصيل مزخرف",
      "صناعة يدوية دقيقة",
      "إضاءة دافئة",
      "قطعة فنية فريدة"
    ]
  },
  {
    name: "طاجين مغربي فخاري",
    nameEn: "Moroccan Clay Tajine",
    description: "طاجين مغربي أصلي مصنوع من الفخار التقليدي، مثالي لتحضير أشهى الأطباق المغربية. يحافظ على نكهة الطعام ويمنحه طعماً فريداً لا يقاوم.",
    descriptionEn: "Authentic Moroccan clay tajine, perfect for preparing the most delicious Moroccan dishes. Preserves food flavors and gives it an irresistible unique taste.",
    price: 280,
    priceMAD: 280,
    category: "أواني طبخ تقليدية",
    categoryEn: "Traditional Cookware",
    image: "/images/tajine.avif",
    stock: 40,
    rating: 4.9,
    numReviews: 156,
    brand: "فخار سلا",
    tags: ["طاجين", "فخار", "طبخ", "تقليدي", "مغربي"],
    features: [
      "فخار طبيعي 100%",
      "صناعة يدوية تقليدية",
      "يحافظ على النكهة",
      "مناسب لجميع أنواع الطبخ"
    ]
  },
  {
    name: "سجادة مغربية بربرية",
    nameEn: "Moroccan Berber Rug",
    description: "سجادة مغربية بربرية أصيلة، نسج يدوياً من الصوف الطبيعي بألوان زاهية وتصاميم هندسية تقليدية. قطعة فنية فريدة تضفي الدفء والجمال على أي مساحة.",
    descriptionEn: "Authentic Moroccan Berber rug, handwoven from natural wool with vibrant colors and traditional geometric designs. A unique artistic piece that adds warmth and beauty to any space.",
    price: 1200,
    priceMAD: 1200,
    category: "سجاد تقليدي",
    categoryEn: "Traditional Rugs",
    image: "/images/tapis.avif",
    stock: 15,
    rating: 4.8,
    numReviews: 98,
    brand: "نساجون أطلس",
    tags: ["سجادة", "بربر", "صوف", "يدوي", "تقليدي"],
    features: [
      "صوف طبيعي 100%",
      "نسج يدوي تقليدي",
      "ألوان طبيعية ثابتة",
      "قطعة فنية فريدة"
    ]
  },
  {
    name: "ابريق شاي مغربي فضي",
    nameEn: "Moroccan Silver Tea Pot",
    description: "ابريق شاي مغربي تقليدي مصنوع من الفضة الإسترليني، مزين بتطريز دقيق يعكس الحرفة المغربية العريقة. مثالي لتحضير الشاي المغربي الأصيل بطعمه المميز.",
    descriptionEn: "Traditional Moroccan tea pot made from sterling silver, decorated with intricate embroidery reflecting ancient Moroccan craftsmanship. Perfect for preparing authentic Moroccan tea with its distinctive taste.",
    price: 450,
    priceMAD: 450,
    category: "أواني شاي تقليدية",
    categoryEn: "Traditional Tea Ware",
    image: "/images/theiere.avif",
    stock: 30,
    rating: 4.7,
    numReviews: 73,
    brand: "صياغة فاس",
    tags: ["ابريق", "شاي", "فضة", "تقليدي", "مغربي"],
    features: [
      "فضة إسترليني 925",
      "تطريز يدوي دقيق",
      "يحافظ على حرارة الشاي",
      "قطعة فنية تقليدية"
    ]
  }
];

export default moroccanProducts;
