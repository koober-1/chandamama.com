import React, { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaShoppingBasket, FaHeart } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { t } from "@/utils/translation";
import Link from 'next/link';

const StaticProductDetail = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const products = {
        'premium-office-stationery-set': {
            name: "Premium Office Stationery Set",
            price: 1499,
            originalPrice: 1999,
            discount: 25,
            rating: 4.8,
            reviews: 124,
            description: "Elevate your workspace with this premium office stationery set. Includes a high-quality leather notebook, metallic pen, sticky notes, and a sleek desk organizer. Perfect for professionals and students alike.",
            images: [
                "https://placehold.co/600x600?text=Stationery+1",
                "https://placehold.co/600x600?text=Stationery+2",
                "https://placehold.co/600x600?text=Stationery+3",
            ],
            features: [
                "Premium leather bound notebook",
                "Smooth writing metallic pen",
                "Compact and sleek desk organizer",
                "Available in multiple colors"
            ]
        },
        'kids-outdoor-sports-kit': {
            name: "Kids Outdoor Sports Kit",
            price: 899,
            originalPrice: 1200,
            discount: 25,
            rating: 4.5,
            reviews: 89,
            description: "A complete outdoor sports kit for kids to keep them active and engaged. Includes a mini football, frisbee, jump rope, and a lightweight carrying bag.",
            images: [
                "https://placehold.co/600x600?text=Sports+Kit+1",
                "https://placehold.co/600x600?text=Sports+Kit+2"
            ],
            features: [
                "Durable and safe materials",
                "Perfect for ages 5-12",
                "Easy to carry everywhere"
            ]
        },
        'living-room-decor-piece': {
            name: "Living Room Decor Piece",
            price: 2499,
            originalPrice: 3000,
            discount: 16,
            rating: 4.9,
            reviews: 42,
            description: "Add a touch of elegance to your living room with this modern decorative piece. Hand-crafted with intricate details, it serves as a perfect centerpiece.",
            images: [
                "https://placehold.co/600x600?text=Decor+1",
                "https://placehold.co/600x600?text=Decor+2",
                "https://placehold.co/600x600?text=Decor+3"
            ],
            features: [
                "Hand-crafted ceramic",
                "Modern minimalist design",
                "Easy to clean"
            ]
        },
        'household-organizer': {
            name: "Household Organizer",
            price: 599,
            originalPrice: 799,
            discount: 25,
            rating: 4.6,
            reviews: 215,
            description: "Keep your home clutter-free with this versatile household organizer. Features multiple compartments for storing everything from cosmetics to office supplies.",
            images: [
                "https://placehold.co/600x600?text=Organizer+1",
                "https://placehold.co/600x600?text=Organizer+2"
            ],
            features: [
                "Multiple adjustable compartments",
                "Durable BPA-free plastic",
                "Space-saving design"
            ]
        }
    };

    const currentProduct = products[slug] || {
        name: "Awesome Product",
        price: 999,
        originalPrice: 1299,
        discount: 23,
        rating: 4.7,
        reviews: 56,
        description: "This is a great product that you will absolutely love. It comes with many features and is built to last.",
        images: [
            "https://placehold.co/600x600?text=Product+Image+1",
            "https://placehold.co/600x600?text=Product+Image+2",
            "https://placehold.co/600x600?text=Product+Image+3"
        ],
        features: ["High quality", "Durable", "Affordable"]
    };

    const recommendedProducts = [
        { name: "PREMIUM OFFICE STATIONERY SET", img: "https://placehold.co/300x300?text=Office+Set", slug: "premium-office-stationery-set" },
        { name: "KIDS OUTDOOR SPORTS KIT", img: "https://placehold.co/300x300?text=Sports+Kit", slug: "kids-outdoor-sports-kit" },
        { name: "LIVING ROOM DECOR PIECE", img: "https://placehold.co/300x300?text=Decor", slug: "living-room-decor-piece" },
        { name: "HOUSEHOLD ORGANIZER", img: "https://placehold.co/300x300?text=Organizer", slug: "household-organizer" },
    ].filter(item => item.slug !== slug); // Don't recommend the current product

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img 
                                src={currentProduct.images[selectedImage]} 
                                alt={currentProduct.name} 
                                className="w-full h-full object-cover transition-all"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {currentProduct.images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === idx ? 'border-[#0084DE] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-3">
                                {currentProduct.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                                    <FaStar className="mr-1" /> {currentProduct.rating}
                                </div>
                                <span className="text-slate-500 text-sm font-medium">{currentProduct.reviews} Reviews</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-extrabold text-[#0084DE]">₹{currentProduct.price}</span>
                            <span className="text-xl text-slate-400 line-through font-medium">₹{currentProduct.originalPrice}</span>
                            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{currentProduct.discount}% OFF</span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {currentProduct.description}
                        </p>

                        <div className="space-y-3">
                            <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-sm">Key Features</h3>
                            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                                {currentProduct.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-800 px-4 py-2 w-32 shrink-0">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                    <FiMinus size={18} />
                                </button>
                                <span className="font-bold text-lg text-slate-800 dark:text-white">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                    <FiPlus size={18} />
                                </button>
                            </div>
                            
                            <button className="flex-1 bg-[#0084DE] hover:bg-[#0070BD] text-white font-bold py-4 px-6 rounded-full transition-colors uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                <FaShoppingBasket size={20} />
                                Add to Cart
                            </button>

                            <button className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shrink-0">
                                <FaHeart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Products Section */}
            <div className="mt-16">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <div className="bg-[#0084DE] dark:bg-[#0070BD] px-6 py-2 whitespace-nowrap rounded-t-lg shadow-xs">
                        <h2 className="text-lg md:text-xl font-black text-white tracking-wide uppercase">RECOMMENDED FOR YOU</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium pb-2 text-base md:text-lg">You might also like these products!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center group bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 mb-4 flex items-center justify-center cursor-pointer">
                                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 text-center uppercase mb-3 px-2 h-10 line-clamp-2">{item.name}</h3>
                            <Link href={`/product/${item.slug}`} className="px-6 py-2 border-2 border-[#0084DE] rounded-full text-xs font-black text-[#0084DE] hover:bg-[#0084DE] hover:text-white dark:border-[#38BDF8] dark:text-[#38BDF8] dark:hover:bg-[#38BDF8] dark:hover:text-slate-900 transition-all bg-transparent text-center w-full max-w-[150px] shadow-xs">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaticProductDetail;
