/**
 * Initial Mock Data matching the UI screenshots
 * Used for Redux initial state and fallback data
 */

export const initialProducts = [
  // -------------------------------------------------------------
  // 1. FRESH VEGETABLES (category_id: 1)
  // -------------------------------------------------------------
  {
    id: 1,
    name: 'Green Chilli',
    slug: 'green-chilli',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 60,
    original_price: 70,
    unit: '250g',
    weight_options: ['250g', '500g', '1 kg'],
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 86,
    is_best_seller: 1,
    stock: 150
  },
  {
    id: 2,
    name: 'Tomato',
    slug: 'tomato',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 25,
    original_price: 30,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg', '2 kg'],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 142,
    is_best_seller: 1,
    stock: 350
  },
  {
    id: 3,
    name: 'Cucumber',
    slug: 'cucumber',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 30,
    original_price: 35,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 75,
    is_best_seller: 1,
    stock: 200
  },
  {
    id: 4,
    name: 'Capsicum',
    slug: 'capsicum',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 40,
    original_price: 50,
    unit: '250g',
    weight_options: ['250 gm', '500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 64,
    is_best_seller: 0,
    stock: 180
  },
  {
    id: 5,
    name: 'Cauliflower',
    slug: 'cauliflower',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 35,
    original_price: 45,
    unit: 'piece',
    weight_options: ['1 piece', '2 piece'],
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80'],
    rating: 4.6,
    reviews_count: 52,
    is_best_seller: 0,
    stock: 90
  },
  {
    id: 6,
    name: 'Lady Finger',
    slug: 'lady-finger',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 35,
    original_price: 45,
    unit: '250g',
    weight_options: ['250 gm', '500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 61,
    is_best_seller: 0,
    stock: 140
  },
  {
    id: 7,
    name: 'Bottle Gourd',
    slug: 'bottle-gourd',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 30,
    original_price: 40,
    unit: '1 kg',
    weight_options: ['1 kg', '2 kg'],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 49,
    is_best_seller: 0,
    stock: 110
  },
  {
    id: 8,
    name: 'Brinjal',
    slug: 'brinjal',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 30,
    original_price: 38,
    unit: '500g',
    weight_options: ['500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 58,
    is_best_seller: 0,
    stock: 130
  },
  {
    id: 9,
    name: 'Carrot',
    slug: 'carrot',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 30,
    original_price: 40,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg', '2 kg'],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 93,
    is_best_seller: 0,
    stock: 220
  },
  {
    id: 11,
    name: 'Potato',
    slug: 'potato',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 20,
    original_price: 25,
    unit: '1 kg',
    weight_options: ['1 kg', '2 kg', '5 kg'],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 115,
    is_best_seller: 1,
    stock: 500
  },
  {
    id: 12,
    name: 'Onion',
    slug: 'onion',
    category_id: 1,
    category_slug: 'vegetables',
    category_name: 'Fresh Vegetables',
    price: 22,
    original_price: 28,
    unit: '1 kg',
    weight_options: ['1 kg', '2 kg', '5 kg'],
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 102,
    is_best_seller: 1,
    stock: 450
  },

  // -------------------------------------------------------------
  // 2. FRESH FRUITS (category_id: 2)
  // -------------------------------------------------------------
  {
    id: 13,
    name: 'Shimla Royal Apple',
    slug: 'shimla-apple',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 120,
    original_price: 140,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg', '2 kg'],
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 118,
    is_best_seller: 1,
    stock: 120
  },
  {
    id: 14,
    name: 'Farm Robusta Banana',
    slug: 'farm-banana',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 45,
    original_price: 55,
    unit: '1 Dozen',
    weight_options: ['6 pcs', '1 Dozen', '2 Dozen'],
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 95,
    is_best_seller: 1,
    stock: 250
  },
  {
    id: 15,
    name: 'Nagpur Sweet Orange',
    slug: 'nagpur-orange',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 80,
    original_price: 95,
    unit: '1 kg',
    weight_options: ['1 kg', '2 kg'],
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 82,
    is_best_seller: 0,
    stock: 140
  },
  {
    id: 16,
    name: 'Ruby Pomegranate (Anar)',
    slug: 'pomegranate',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 140,
    original_price: 165,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 74,
    is_best_seller: 1,
    stock: 90
  },
  {
    id: 17,
    name: 'Sweet Farm Papaya',
    slug: 'sweet-papaya',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 50,
    original_price: 60,
    unit: '1 piece',
    weight_options: ['1 piece (~1kg)', '2 piece'],
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 67,
    is_best_seller: 0,
    stock: 80
  },
  {
    id: 18,
    name: 'Fresh Allahabad Guava',
    slug: 'fresh-guava',
    category_id: 2,
    category_slug: 'fruits',
    category_name: 'Fresh Fruits',
    price: 60,
    original_price: 75,
    unit: '1 kg',
    weight_options: ['500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 53,
    is_best_seller: 0,
    stock: 110
  },

  // -------------------------------------------------------------
  // 3. FRESH MUSHROOM (category_id: 3)
  // -------------------------------------------------------------
  {
    id: 10,
    name: 'Fresh Oyster Mushroom',
    slug: 'fresh-oyster-mushroom',
    category_id: 3,
    category_slug: 'mushroom',
    category_name: 'Fresh Mushroom',
    price: 60,
    original_price: 67,
    unit: '200 gm',
    weight_options: ['200 gm', '500 gm', '1 kg'],
    image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 5.0,
    reviews_count: 128,
    is_best_seller: 1,
    stock: 160
  },
  {
    id: 19,
    name: 'Fresh White Button Mushroom',
    slug: 'white-button-mushroom',
    category_id: 3,
    category_slug: 'mushroom',
    category_name: 'Fresh Mushroom',
    price: 50,
    original_price: 60,
    unit: '200 gm',
    weight_options: ['200 gm', '400 gm'],
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 91,
    is_best_seller: 1,
    stock: 140
  },
  {
    id: 20,
    name: 'Organic Milky Mushroom',
    slug: 'milky-mushroom',
    category_id: 3,
    category_slug: 'mushroom',
    category_name: 'Fresh Mushroom',
    price: 75,
    original_price: 90,
    unit: '250 gm',
    weight_options: ['250 gm', '500 gm'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 42,
    is_best_seller: 0,
    stock: 70
  },

  // -------------------------------------------------------------
  // 4. FARM FRESH / GREENS (category_id: 4)
  // -------------------------------------------------------------
  {
    id: 21,
    name: 'Crisp Hydroponic Spinach (Palak)',
    slug: 'hydroponic-spinach',
    category_id: 4,
    category_slug: 'farm-fresh',
    category_name: 'Farm Fresh',
    price: 25,
    original_price: 35,
    unit: '250g',
    weight_options: ['250g', '500g'],
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 67,
    is_best_seller: 1,
    stock: 130
  },
  {
    id: 22,
    name: 'Aromatic Fresh Coriander (Dhaniya)',
    slug: 'fresh-coriander',
    category_id: 4,
    category_slug: 'farm-fresh',
    category_name: 'Farm Fresh',
    price: 15,
    original_price: 20,
    unit: '100g',
    weight_options: ['100g', '250g'],
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80'],
    rating: 4.9,
    reviews_count: 85,
    is_best_seller: 1,
    stock: 200
  },
  {
    id: 23,
    name: 'Refreshing Farm Mint (Pudina)',
    slug: 'fresh-mint',
    category_id: 4,
    category_slug: 'farm-fresh',
    category_name: 'Farm Fresh',
    price: 15,
    original_price: 20,
    unit: '100g',
    weight_options: ['100g', '200g'],
    image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=600&q=80'],
    rating: 4.7,
    reviews_count: 48,
    is_best_seller: 0,
    stock: 120
  },
  {
    id: 24,
    name: 'Organic Farm Ginger (Adrak)',
    slug: 'fresh-ginger',
    category_id: 4,
    category_slug: 'farm-fresh',
    category_name: 'Farm Fresh',
    price: 35,
    original_price: 45,
    unit: '250g',
    weight_options: ['250g', '500g', '1 kg'],
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
    gallery: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80'],
    rating: 4.8,
    reviews_count: 73,
    is_best_seller: 1,
    stock: 160
  }
];

export const initialCategories = [
  {
    id: 1,
    name: 'Fresh Vegetables',
    slug: 'vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    product_count: 11
  },
  {
    id: 2,
    name: 'Fresh Fruits',
    slug: 'fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80',
    product_count: 6
  },
  {
    id: 3,
    name: 'Fresh Mushroom',
    slug: 'mushroom',
    image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=400&q=80',
    product_count: 3
  },
  {
    id: 4,
    name: 'Farm Fresh',
    slug: 'farm-fresh',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    product_count: 4
  }
];

export const initialUser = {
  id: 1,
  name: 'Ravi Verma',
  email: 'ravi.verma@example.com',
  phone: '9827112345',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  address: 'House No. 42, Ward No. 4, Main Road, Bemetara, Chhattisgarh 491335',
  city: 'Bemetara',
  pincode: '491335',
  joinDate: 'March 2024'
};

export const initialAddresses = [
  {
    id: 1,
    title: 'Home',
    recipient_name: 'Ravi Verma',
    phone: '9827112345',
    address_line: 'House No. 42, Ward No. 4, Near Gandhi Chowk',
    landmark: 'Opposite State Bank',
    city: 'Bemetara',
    pincode: '491335',
    is_default: true,
    type: 'Home'
  },
  {
    id: 2,
    title: 'Farm Office',
    recipient_name: 'Ravi Verma (Office)',
    phone: '9827112345',
    address_line: 'Plot 18, Agriculture Hub, Raipur Road',
    landmark: 'Near Mandi Gate',
    city: 'Bemetara',
    pincode: '491335',
    is_default: false,
    type: 'Work'
  }
];

export const initialUserOrders = [
  {
    order_id: '#ORD1256',
    order_date: '06 Jun 2024, 10:30 AM',
    status: 'Processing',
    subtotal: 650,
    delivery_fee: 0,
    discount: 10,
    total_amount: 640,
    payment_method: 'Cash on Delivery (COD)',
    delivery_address: 'House No. 42, Ward No. 4, Main Road, Bemetara, Chhattisgarh 491335',
    items: [
      {
        id: 10,
        name: 'Fresh Oyster Mushroom',
        price: 60,
        quantity: 2,
        unit: '200 gm',
        image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 2,
        name: 'Tomato',
        price: 25,
        quantity: 2,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 13,
        name: 'Shimla Royal Apple',
        price: 120,
        quantity: 1,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    order_id: '#ORD1248',
    order_date: '28 May 2024, 04:15 PM',
    status: 'Delivered',
    subtotal: 420,
    delivery_fee: 0,
    discount: 20,
    total_amount: 400,
    payment_method: 'Online UPI',
    delivery_address: 'House No. 42, Ward No. 4, Main Road, Bemetara, Chhattisgarh 491335',
    items: [
      {
        id: 11,
        name: 'Potato',
        price: 20,
        quantity: 5,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 12,
        name: 'Onion',
        price: 22,
        quantity: 3,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export const initialDashboard = {
  stats: {
    total_orders: { value: 125, growth: '+18%', label: 'This Month' },
    total_sales: { value: '₹54,320', growth: '+22%', label: 'This Month' },
    total_customers: { value: 432, growth: '+15%', label: 'This Month' },
    pending_orders: { value: 18, growth: null, label: 'View Orders' }
  },
  sales_chart: [
    { day: 'Mon', sales: 7000 },
    { day: 'Tue', sales: 11000 },
    { day: 'Wed', sales: 9500 },
    { day: 'Thu', sales: 15200 },
    { day: 'Fri', sales: 12400 },
    { day: 'Sat', sales: 18500 },
    { day: 'Sun', sales: 14300 }
  ],
  top_selling: [
    { name: 'Tomato', sales_kg: '245 kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80', price: '₹25 / 1kg' },
    { name: 'Potato', sales_kg: '210 kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=150&q=80', price: '₹20 / 1kg' },
    { name: 'Onion', sales_kg: '185 kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=150&q=80', price: '₹22 / 1kg' },
    { name: 'Fresh Mushroom', sales_kg: '135 kg', image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=150&q=80', price: '₹120 / 200g' },
    { name: 'Green Chilli', sales_kg: '95 kg', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=150&q=80', price: '₹60 / 250g' }
  ],
  recent_orders: [
    { order_id: '#ORD1256', customer: 'Ravi Verma', amount: '₹650', status: 'Delivered' },
    { order_id: '#ORD1255', customer: 'Neha Patel', amount: '₹320', status: 'Processing' },
    { order_id: '#ORD1254', customer: 'Suresh Yadav', amount: '₹515', status: 'Delivered' },
    { order_id: '#ORD1253', customer: 'Kavita Sahu', amount: '₹280', status: 'Pending' },
    { order_id: '#ORD1252', customer: 'Aman Tiwari', amount: '₹730', status: 'Delivered' }
  ],
  date_range: '31 May - 06 Jun 2024'
};

export const initialCoupons = [
  { id: 1, code: 'JSR10', discount_type: 'flat', discount_value: 10.00, min_order_value: 100.00, status: 1 },
  { id: 2, code: 'FREESHIP', discount_type: 'flat', discount_value: 25.00, min_order_value: 150.00, status: 1 },
  { id: 3, code: 'SAVE20', discount_type: 'percentage', discount_value: 20.00, min_order_value: 300.00, status: 1 },
  { id: 4, code: 'WELCOME50', discount_type: 'flat', discount_value: 50.00, min_order_value: 400.00, status: 0 }
];

export const initialDeliveryAreas = [
  { id: 1, pincode: '491335', area_name: 'Bemetara Central & Suburbs', city: 'Bemetara', delivery_charge: 0.00, estimated_delivery: 'Under 2 Hours', status: 1 },
  { id: 2, pincode: '492001', area_name: 'Raipur City Center, Civil Lines', city: 'Raipur', delivery_charge: 0.00, estimated_delivery: 'Same Day Evening', status: 1 },
  { id: 3, pincode: '492007', area_name: 'Shankar Nagar, Pandri', city: 'Raipur', delivery_charge: 0.00, estimated_delivery: 'Same Day Evening', status: 1 },
  { id: 4, pincode: '490006', area_name: 'Durg / Bhilai Region', city: 'Durg', delivery_charge: 20.00, estimated_delivery: 'Next Morning Delivery', status: 1 },
  { id: 5, pincode: '491331', area_name: 'Saja & Nearby Mandi', city: 'Bemetara', delivery_charge: 15.00, estimated_delivery: 'Next Day Morning', status: 1 }
];

