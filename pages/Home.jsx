import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Wallet, Brain,
  ArrowRight, Star, Users, Globe,
  ShieldCheck, PlayCircle
} from 'lucide-react';

const Home = ({ user }) => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#0a0a0f] font-sans overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like fix */}
        <div className="absolute inset-0 z-0">
          <img
            src="home.jpg"
            alt="Beautiful Landscape"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-slate-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 mb-6 mx-auto">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500/100"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide uppercase">AI-Powered Travel Agent</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-none">
              Experience the World, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Effortlessly.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Plan specialized itineraries, track expenses real-time, and discover hidden gems—all curated by advanced AI in seconds.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={user ? "/dashboard" : "/create-trip"}
                className="group relative px-8 py-4 bg-teal-500/100 rounded-full font-bold text-white shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-all hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full" />
                <span className="relative flex items-center gap-2">
                  Start Planning Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <button
                className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-bold text-white hover:bg-white/10 transition-all hover:-translate-y-1"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                <PlayCircle className="w-5 h-5" />
                What's New
              </button>
            </motion.div>

            {/* Stats Strip */}
            <motion.div variants={fadeInUp} className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Happy Travelers', value: '50k+', icon: Users },
                { label: 'Trips Planned', value: '120k+', icon: Globe },
                { label: 'Destinations', value: '100+', icon: MapPin },
                { label: 'App Rating', value: '4.9/5', icon: Star },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-2 text-teal-400">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Segment */}
      <section id="features" className="py-24 px-6 relative bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-teal-400 font-bold tracking-wide uppercase text-sm mb-3">Why Choose TripPlan?</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Everything you need for the <br />
              <span className="underline decoration-blue-500/30 decoration-wavy">perfect journey.</span>
            </h3>
            <p className="text-gray-500 text-xl leading-relaxed">
              We combine cutting-edge AI with intuitive design to solve the chaos of travel planning once and for all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Itinerary Generation",
                desc: "Tell us your interests and budget, and our AI builds a day-by-day plan instantly.",
                color: "bg-purple-100 text-purple-600"
              },
              {
                icon: Wallet,
                title: "Smart Budgeting",
                desc: "Track every penny. Get cost estimates for hotels, food, and activities before you go.",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: MapPin,
                title: "Interactive Maps",
                desc: "Visualize your trip. See optimal routes and nearby attractions on an interactive map.",
                color: "bg-blue-100 text-teal-400"
              },
              {
                icon: Calendar,
                title: "Real-time Sync",
                desc: "Export to Google Calendar and share your live itinerary with travel companions.",
                color: "bg-orange-100 text-orange-600"
              },
              {
                icon: Globe,
                title: "Local Insights",
                desc: "Get suggestions for hidden gems and local favorites, not just terrorist traps.",
                color: "bg-teal-100 text-teal-400"
              },
              {
                icon: ShieldCheck,
                title: "Travel Safety",
                desc: "Real-time safety alerts and emergency contact info for every destination.",
                color: "bg-red-100 text-red-400"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[2rem] bg-[#0a0a0f] border border-white/5 hover:bg-white/5 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-100 mb-3">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Visual UI */}
      <section className="py-24 px-6 bg-gray-950 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/100 rounded-full blur-[128px]" />
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Plan smarter, not harder.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From inspiration to boarding pass in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 border-t border-dashed border-white/20" />

            {[
              {
                step: "01",
                title: "Define Your Style",
                desc: "Enter your budget, dates, and destination preferences."
              },
              {
                step: "02",
                title: "Get Matched",
                desc: "Our AI generates a tailored itinerary in seconds."
              },
              {
                step: "03",
                title: "Book & Go",
                desc: "Secure hotels and activities with one click."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="text-center relative z-10"
              >
                <div className="w-24 h-24 mx-auto bg-gray-900 rounded-full border-4 border-gray-800 flex items-center justify-center text-3xl font-bold text-teal-400 shadow-xl shadow-teal-500/10 mb-8 relative">
                  {item.step}
                  <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping opacity-20" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Loved by travelers worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-8 rounded-2xl shadow-lg border border-white/5"
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-400 mb-6 italic">
                  "This app completely changed how I travel. I found amazing local spots in Tokoyo that I would have never found on my own!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/thumb/women/${i + 40}.jpg`} alt="User" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Sarah Jenkins</h4>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Solo Traveler</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-teal-700 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
              Ready to start your adventure?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join the community of modern explorers. It's free to get started.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-white/5 text-teal-400 px-12 py-5 rounded-full text-xl font-bold hover:bg-white/5 hover:scale-105 transition-all shadow-xl"
            >
              Get Started Now
            </Link>
            <p className="mt-6 text-sm text-blue-200 opacity-80">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;



