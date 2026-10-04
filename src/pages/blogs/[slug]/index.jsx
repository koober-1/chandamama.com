import React from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';

const BlogDetailPage = () => {
    const router = useRouter();
    const { slug } = router.query;

    // Static data mapping based on slug
    const blogsContent = {
        'top-5-educational-toys': {
            title: "Top 5 Educational Toys for Toddlers",
            date: "Sep 29, 2026",
            author: "Child Development Expert",
            category: "Parenting",
            img: "https://placehold.co/1200x600?text=Blog+1+Banner",
            content: `
                Play is the foundation of learning for young children. When selecting toys for toddlers, it's crucial to pick items that are not just entertaining but also stimulate their cognitive and motor skills. Here are our top 5 educational toys for 2026:
                
                1. Magnetic Building Blocks: These encourage spatial awareness and creative thinking.
                2. Shape Sorters: A classic toy that teaches problem-solving and hand-eye coordination.
                3. Interactive Storybooks: Enhances early literacy and listening skills.
                4. Musical Instrument Sets: Introduces rhythm and sensory exploration.
                5. Simple Puzzles: Great for patience, logic, and fine motor development.
                
                Remember, the best educational toys are those that require active participation from the child rather than passive observation.
            `
        },
        'choose-yoga-mat': {
            title: "How to Choose the Perfect Yoga Mat",
            date: "Sep 26, 2026",
            author: "Fitness Coach",
            category: "Health & Fitness",
            img: "https://placehold.co/1200x600?text=Blog+2+Banner",
            content: `
                A good yoga mat can make a world of difference in your practice. With so many options on the market, finding the perfect one can feel overwhelming. Here is a quick guide to help you choose:
                
                **Thickness Matters:** If you need more cushioning for your joints, opt for a mat that is at least 6mm thick. For travel and better balance in standing poses, a thinner mat (3mm) is ideal.
                
                **Material:** PVC mats offer the best grip and durability. However, if you prefer eco-friendly options, look for natural rubber, cork, or jute mats.
                
                **Texture:** The texture dictates how much traction the mat provides. A textured mat prevents slipping during sweaty sessions.
                
                Take your time to test different mats and find the one that aligns with your practice style and comfort needs.
            `
        },
        'must-have-kitchen-gadgets': {
            title: "10 Must-Have Kitchen Gadgets for 2026",
            date: "Sep 22, 2026",
            author: "Culinary Enthusiast",
            category: "Home & Kitchen",
            img: "https://placehold.co/1200x600?text=Blog+3+Banner",
            content: `
                Upgrading your kitchen doesn't necessarily mean a full remodel. Sometimes, adding a few smart gadgets can drastically improve your cooking efficiency and enjoyment. Here are the must-have kitchen gadgets this year:
                
                **Smart Food Scale:** Connects to your phone to give precise nutritional information.
                **Multi-functional Air Fryer:** Bake, roast, and fry with less oil.
                **Digital Meat Thermometer:** Never undercook or overcook your meats again.
                **Automatic Stirrer:** A hands-free way to keep sauces from burning.
                **Compact Vacuum Sealer:** Keep your ingredients fresh for longer.
                
                Investing in these tools will save you time and inspire you to try new recipes with confidence.
            `
        }
    };

    const currentBlog = blogsContent[slug] || {
        title: "Blog Article Not Found",
        date: "",
        author: "",
        category: "",
        img: "https://placehold.co/1200x600?text=Not+Found",
        content: "Sorry, the blog article you are looking for does not exist."
    };

    return (
        <Layout>
            <Head>
                <title>{currentBlog.title} - Chandamama Store</title>
            </Head>
            <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen pt-28 pb-16 px-4 transition-colors duration-200">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                        {/* Header Image */}
                        <div className="w-full h-64 md:h-[400px] relative">
                            <img src={currentBlog.img} alt={currentBlog.title} className="w-full h-full object-cover" />
                            {currentBlog.category && (
                                <div className="absolute top-4 left-4 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                    {currentBlog.category}
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                                <span>{currentBlog.date}</span>
                                <span>•</span>
                                <span>By {currentBlog.author}</span>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight mb-8">
                                {currentBlog.title}
                            </h1>
                            
                            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
                                {currentBlog.content.split('\n').map((paragraph, idx) => (
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
            { params: { slug: 'top-5-educational-toys' } },
            { params: { slug: 'choose-yoga-mat' } },
            { params: { slug: 'must-have-kitchen-gadgets' } }
        ],
        fallback: false
    };
}

export async function getStaticProps(context) {
    return {
        props: {}
    };
}

export default BlogDetailPage;
