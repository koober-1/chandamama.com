const http = require("http");

const PORT = 8000;

// Helper to encode JSON to base64 (required by frontend for settings endpoints)
const toBase64 = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64");

const settingsData = {
  app_name: "Chandaamama",
  support_number: "+91 9876543210",
  support_email: "support@chandamama.com",
  currency: "₹",
  currency_code: "INR",
  decimal_point: "2",
  default_city: {
    id: 1,
    name: "Mumbai",
    latitude: "19.0760",
    longitude: "72.8777"
  },
  web_settings: {
    site_title: "Chandaamama - Online Grocery Store",
    color: "#0e947a",
    light_color: "#e6f7f3",
    website_mode: 0,
    website_mode_remark: "",
    app_name: "Chandaamama",
    web_logo: "/logo.png",
    light_logo: "/logo.png",
    copyright_details: "© 2026 Chandaamama. All rights reserved."
  },
  favicon: "/favicon.ico",
  popup_enabled: "0",
  favorite_product_ids: []
};

const paymentSettingsData = {
  cod_payment_method: "1",
  razorpay_payment_method: "0",
  stripe_payment_method: "0",
  paystack_payment_method: "0"
};

const languagesData = [
  {
    id: 15,
    name: "English",
    code: "en",
    type: "LTR",
    system_type: 3,
    is_default: 1,
    display_name: "English",
    system_type_name: "Website"
  }
];

const cityData = {
  id: 1,
  name: "Mumbai",
  latitude: "19.0760",
  longitude: "72.8777",
  min_amount_for_free_delivery: 500,
  delivery_charge_method: "fixed"
};

const categoriesData = [
  {
    id: 1,
    name: "Fruits & Vegetables",
    slug: "fruits-and-vegetables",
    image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80",
    has_child: false,
    has_active_child: false
  },
  {
    id: 2,
    name: "Dairy & Breakfast",
    slug: "dairy-and-breakfast",
    image_url: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=300&q=80",
    has_child: false,
    has_active_child: false
  },
  {
    id: 3,
    name: "Snacks & Munchies",
    slug: "snacks-and-munchies",
    image_url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=300&q=80",
    has_child: false,
    has_active_child: false
  },
  {
    id: 4,
    name: "Beverages & Juices",
    slug: "beverages",
    image_url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80",
    has_child: false,
    has_active_child: false
  }
];

const productsData = [
  {
    id: 101,
    name: "Fresh Royal Gala Apples",
    slug: "fresh-royal-gala-apples",
    image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    ratings_count: 124,
    is_favorite: false,
    seller_name: "FreshFarm Organics",
    seller_id: 1,
    category_id: 1,
    variants: [
      {
        id: 201,
        type: "pack",
        measurement: "1",
        measurement_unit_name: "kg",
        price: 180,
        discounted_price: 149,
        stock: 50,
        status: 1
      }
    ]
  },
  {
    id: 102,
    name: "Farm Fresh Whole Milk",
    slug: "farm-fresh-whole-milk",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    ratings_count: 310,
    is_favorite: false,
    seller_name: "Dairy Best",
    seller_id: 2,
    category_id: 2,
    variants: [
      {
        id: 202,
        type: "pack",
        measurement: "1",
        measurement_unit_name: "L",
        price: 70,
        discounted_price: 64,
        stock: 100,
        status: 1
      }
    ]
  },
  {
    id: 103,
    name: "Crunchy Roasted Almonds",
    slug: "crunchy-roasted-almonds",
    image_url: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    ratings_count: 89,
    is_favorite: false,
    seller_name: "NutriStore",
    seller_id: 1,
    category_id: 3,
    variants: [
      {
        id: 203,
        type: "pack",
        measurement: "500",
        measurement_unit_name: "g",
        price: 450,
        discounted_price: 399,
        stock: 35,
        status: 1
      }
    ]
  },
  {
    id: 104,
    name: "Fresh Hass Avocado",
    slug: "fresh-hass-avocado",
    image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    ratings_count: 52,
    is_favorite: false,
    seller_name: "FreshFarm Organics",
    seller_id: 1,
    category_id: 1,
    variants: [
      {
        id: 204,
        type: "pack",
        measurement: "2",
        measurement_unit_name: "pcs",
        price: 220,
        discounted_price: 189,
        stock: 20,
        status: 1
      }
    ]
  }
];

const slidersData = [
  {
    id: 1,
    type: "default",
    type_id: 0,
    image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    title: "Fresh Farm Groceries Delivered",
    short_description: "Quality staples delivered directly to your doorstep."
  },
  {
    id: 2,
    type: "default",
    type_id: 0,
    image_url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
    title: "Weekly Grocery Specials",
    short_description: "Enjoy up to 30% off on fresh seasonal fruits and dairy."
  }
];

const shopData = {
  sliders: slidersData,
  categories: categoriesData,
  offers: [],
  sections: [
    {
      id: 1,
      title: "Popular Daily Essentials",
      short_description: "Customer favorites this week",
      style_web: "style_1",
      position: "below_slider",
      products: productsData
    }
  ],
  brands: [
    {
      id: 1,
      name: "Organic Valley",
      image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80"
    }
  ],
  sellers: [
    {
      id: 1,
      name: "FreshFarm Organics",
      store_name: "FreshFarm Organics",
      logo_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80"
    }
  ]
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`[Mock API] ${req.method} ${pathname}`);

  const sendJSON = (data, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  // Route Handlers
  if (pathname === "/customer/settings" || pathname === "/customer/settings/") {
    sendJSON({
      status: 1,
      message: "Settings fetched successfully",
      data: toBase64(settingsData)
    });
  } else if (pathname.includes("/customer/settings/payment_methods")) {
    sendJSON({
      status: 1,
      message: "Payment methods fetched successfully",
      data: toBase64(paymentSettingsData)
    });
  } else if (pathname.includes("/customer/system_languages")) {
    sendJSON({
      status: 1,
      message: "System languages fetched successfully",
      data: languagesData
    });
  } else if (pathname.includes("/customer/city")) {
    sendJSON({
      status: 1,
      message: "City fetched successfully",
      data: cityData
    });
  } else if (pathname.includes("/customer/shop")) {
    sendJSON({
      status: 1,
      message: "Shop data fetched successfully",
      data: shopData
    });
  } else if (pathname.includes("/customer/categories")) {
    sendJSON({
      status: 1,
      message: "Categories fetched successfully",
      data: categoriesData
    });
  } else if (pathname.includes("/customer/products")) {
    sendJSON({
      status: 1,
      message: "Products fetched successfully",
      total: productsData.length,
      data: productsData
    });
  } else if (pathname.includes("/customer/sliders")) {
    sendJSON({
      status: 1,
      message: "Sliders fetched successfully",
      data: slidersData
    });
  } else if (pathname.includes("/customer/cart")) {
    sendJSON({
      status: 1,
      message: "Cart fetched successfully",
      data: { cart: [], total_quantity: 0, sub_total: 0 }
    });
  } else if (pathname.includes("/customer/favorites")) {
    sendJSON({
      status: 1,
      message: "Favorites fetched successfully",
      data: []
    });
  } else if (pathname.includes("/customer/brands")) {
    sendJSON({
      status: 1,
      message: "Brands fetched successfully",
      data: shopData.brands
    });
  } else if (pathname.includes("/customer/sellers")) {
    sendJSON({
      status: 1,
      message: "Sellers fetched successfully",
      data: shopData.sellers
    });
  } else {
    // Default fallback for any other customer endpoint
    sendJSON({
      status: 1,
      message: "Success",
      data: []
    });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`Endpoint base: http://localhost:${PORT}/customer/`);
});
