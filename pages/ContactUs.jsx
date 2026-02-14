import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send, MapPin, Phone, Globe } from 'lucide-react';

const ContactUs = () => {
    const [formStatus, setFormStatus] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('sending');
        setTimeout(() => {
            setFormStatus('success');
            setTimeout(() => setFormStatus('idle'), 3000);
        }, 1500);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] font-sans">

            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[450px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/contactus.jpg"
                        alt="Tropical Beach Contact"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-950/50 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold mb-4 backdrop-blur-md">
                            24/7 Support
                        </span>
                        <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-lg tracking-tight">
                            We're Here to Help You <br />
                            <span className="text-teal-400">Plan Your Perfect Adventure</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-300 font-medium max-w-2xl mx-auto drop-shadow-md">
                            Have questions about your itinerary? Need travel tips? Reach out to our team of travel experts.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">

                {/* Contact Methods Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Email Card */}
                    <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/[0.06] flex flex-col items-center text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-colors">
                            <Mail className="w-8 h-8 text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                        <p className="text-gray-500 mb-6">For detailed inquiries and travel docs.</p>
                        <a
                            href="mailto:support@tripplan.com"
                            className="px-6 py-2.5 rounded-xl bg-teal-500/10 text-teal-400 font-bold hover:bg-teal-500 hover:text-black transition-all w-full border border-teal-500/20 hover:border-teal-500"
                        >
                            Send Email
                        </a>
                    </motion.div>

                    {/* WhatsApp Card */}
                    <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/[0.06] flex flex-col items-center text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                            <MessageCircle className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">WhatsApp Chat</h3>
                        <p className="text-gray-500 mb-6">Quick answers and instant support.</p>
                        <a
                            href="https://wa.me/1234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500 hover:text-black transition-all w-full border border-emerald-500/20 hover:border-emerald-500"
                        >
                            Chat Now
                        </a>
                    </motion.div>

                    {/* Office Card */}
                    <motion.div variants={fadeInUp} className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-8 border border-white/[0.06] flex flex-col items-center text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all hover:-translate-y-1 group">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                            <MapPin className="w-8 h-8 text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Global HQ</h3>
                        <p className="text-gray-500 mb-6">Come visit our travel lounge.</p>
                        <button className="px-6 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 font-bold hover:bg-orange-500 hover:text-black transition-all w-full border border-orange-500/20 hover:border-orange-500">
                            View Map
                        </button>
                    </motion.div>
                </motion.div>

                {/* Contact Form Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Form Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
                        <p className="text-gray-500 mb-8 text-lg">
                            Whether you have a question about features, pricing, or need a custom travel plan, our team is ready to answer all your questions.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all hover:bg-white/[0.05]"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all hover:bg-white/[0.05]"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all hover:bg-white/[0.05]"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">Your Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all resize-none hover:bg-white/[0.05]"
                                    placeholder="Tell us about your dream trip..."
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={formStatus === 'sending' || formStatus === 'success'}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${formStatus === 'success'
                                    ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                                    : 'bg-teal-500 text-black hover:bg-teal-400 shadow-teal-500/20'
                                    }`}
                            >
                                {formStatus === 'idle' && (
                                    <>Send Message <Send className="w-5 h-5" /></>
                                )}
                                {formStatus === 'sending' && (
                                    <>Sending... <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full ml-2" /></>
                                )}
                                {formStatus === 'success' && (
                                    <>Message Sent! <span className="text-xl">✓</span></>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Decorative Image/Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:block relative h-full min-h-[500px] rounded-3xl overflow-hidden border border-white/[0.06]"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=2067&auto=format&fit=crop"
                            alt="Customer Support Travel"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Floating Info Card */}
                        <div className="absolute bottom-8 left-8 right-8 bg-black/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="bg-teal-500/10 p-3 rounded-full border border-teal-500/20">
                                    <Globe className="w-6 h-6 text-teal-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Global Reach</p>
                                    <p className="text-sm text-gray-400">Supporting travelers in 190+ countries</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;
