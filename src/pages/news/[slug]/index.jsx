import React from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';

const NewsDetailPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    // Static data mapping based on slug
    const newsContent = {
        'expands-delivery': {
            title: "Chandamama Store Expands Delivery Reach",
            date: "Sep 28, 2026",
            author: "Admin",
            img: "https://placehold.co/1200x600?text=News+1+Banner",
            content: `
                We are thrilled to announce that Chandamama Store is now expanding its delivery reach to cover 50+ new cities across the country! This milestone represents our commitment to making quality products accessible to more families than ever before.
                
                With our newly established logistics partnerships, we guarantee faster and more reliable deliveries. Customers in the newly added regions can now enjoy the same seamless shopping experience, complete with live tracking and dedicated customer support.
                
                Stay tuned as we continue to grow and bring the best products right to your doorstep.
            `
        },
        'festive-sale-2026': {
            title: "Festive Sale 2026: Biggest Discounts Revealed",
            date: "Sep 25, 2026",
            author: "Marketing Team",
            img: "https://placehold.co/1200x600?text=News+2+Banner",
            content: `
                Get ready for the most anticipated event of the year! Our Festive Sale 2026 is officially here, and the discounts are bigger and better than ever. 
                
                From top-rated educational toys to premium home and kitchen appliances, enjoy up to 70% off across all categories. We have also introduced exclusive flash sales that happen every 4 hours, giving you a chance to grab your favorite items at unbeatable prices.
                
                Don't miss out! The sale lasts for a limited time only. Start filling up your carts today and experience the joy of gifting with Chandamama Store.
            `
        },
        'new-partnership': {
            title: "New Partnership with Global Toy Brands",
            date: "Sep 20, 2026",
            author: "PR Team",
            img: "https://placehold.co/1200x600?text=News+3+Banner",
            content: `
                Chandamama Store is proud to announce our latest strategic partnership with several leading global toy brands. This collaboration will bring an exclusive range of award-winning, STEM-focused toys directly to our platform.
                
                Our goal has always been to provide children with tools that foster creativity and learning. By joining hands with international manufacturers renowned for their safety and innovation, we ensure that parents have access to the absolute best.
                
                Explore the new collections launching next week and give your children the gift of joyful learning.
            `
        }
    };

    const currentNews = newsContent[slug] || {
        title: "News Article Not Found",
        date: "",
        author: "",
        img: "https://placehold.co/1200x600?text=Not+Found",
        content: "Sorry, the news article you are looking for does not exist."
    };

    return (
        <Layout>
            <Head>
                <title>{currentNews.title} - Chandamama Store</title>
            </Head>
            <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pt-28 pb-16 px-4 transition-colors duration-200">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                        {/* Header Image */}
                        <div className="w-full h-64 md:h-[400px] relative">
                            <img src={currentNews.img} alt={currentNews.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-[#0084DE] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                Latest News
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                                <span>{currentNews.date}</span>
                                <span>•</span>
                                <span>By {currentNews.author}</span>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-8">
                                {currentNews.title}
                            </h1>
                            
                            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
                                {currentNews.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph.trim()}</p>
                                ))}
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={() => router.push('/')} className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    ← Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export async function getStaticPaths() {
    return {
        paths: [
            { params: { slug: 'expands-delivery' } },
            { params: { slug: 'festive-sale-2026' } },
            { params: { slug: 'new-partnership' } }
        ],
        fallback: false
    };
}

export async function getStaticProps(context) {
    return {
        props: {}
    };
}

export default NewsDetailPage;
