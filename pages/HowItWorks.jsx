import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, PieChart, Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const steps = [
        {
            id: 1,
            title: 'Share Your Dream',
            description: 'Tell us where you want to go, your budget, and what you love. Our AI analyzes thousands of data points to understand your travel style.',
            icon: <MapPin className="w-8 h-8 text-white" />,
            color: 'bg-teal-500/100',
        },
        {
            id: 2,
            title: 'AI Generates Itinerary',
            description: 'In seconds, get a complete day-by-day plan. We optimize routes, suggest hidden gems, and balance your schedule perfectly.',
            icon: <Sparkles className="w-8 h-8 text-white" />,
            color: 'bg-teal-500/100',
        },
        {
            id: 3,
            title: 'Smart Budget Tracking',
            description: 'Keep your finances in check effortlessly. We estimate costs for hotels, dining, and activities so you can travel without worry.',
            icon: <PieChart className="w-8 h-8 text-white" />,
            color: 'bg-emerald-500',
        },
        {
            id: 4,
            title: 'One-Tap Export',
            description: 'Ready to go? Save your itinerary, share it with friends, or sync it to your calendar. Your adventure is just a click away.',
            icon: <Plane className="w-8 h-8 text-white" />,
            color: 'bg-sky-500',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] font-sans">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background with overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="how-its-works.jpg"
                        alt="Travel Adventure"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-950/40 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
                            Discover How Your <br className="hidden md:block" />
                            <span className="text-teal-400">AI-Powered Adventure</span> Begins
                        </h1>
                        <p className="text-lg md:text-xl text-slate-100 mb-8 font-medium max-w-2xl mx-auto drop-shadow-md">
                            Planning a trip used to take weeks. Now it takes seconds. See how we turn your travel dreams into reality.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto -mt-20 relative z-20">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            variants={fadeIn}
                            className={`group bg-white/[0.03] backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12] overflow-hidden relative ${index % 2 === 1 ? 'md:mt-12' : ''
                                }`}
                        >
                            {/* Decorative Background Blur */}
                            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10 blur-3xl ${step.color}`} />

                            <div className="relative z-10 flex flex-col items-start gap-4">
                                <div className={`${step.color} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-100">
                                    <span className="text-gray-400 text-lg mr-2 font-mono">0{step.id}.</span>
                                    {step.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 text-center bg-[#0a0a0f]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] p-12 shadow-2xl border border-white/[0.06] relative overflow-hidden"
                >
                    {/* Background Map Pattern (SVG or CSS) */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2dd4bf 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-100 mb-6">
                            Ready to Explore the World?
                        </h2>
                        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                            Join thousands of travelers who are planning smarter, faster, and better. Your next adventure is waiting.
                        </p>

                        <Link
                            to="/create-trip"
                            className="inline-flex items-center gap-3 bg-teal-500 text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-1"
                        >
                            Start Planning Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default HowItWorks;


