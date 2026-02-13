import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Plane, Globe } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: 'user-' + Date.now(),
        username: username,
        email: email
      };

      onLogin(mockUser);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await userInfoResponse.json();

        const googleUser = {
          id: userInfo.sub,
          username: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: 'google'
        };

        onLogin(googleUser);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Failed:', errorResponse);
      setIsLoading(false);
    }
  });

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: 'fb-user-' + Date.now(),
        username: 'Facebook User',
        email: 'facebook@example.com',
        provider: 'facebook'
      };
      onLogin(mockUser);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0a0a0f] overscroll-none">

      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden text-white bg-gray-950">
        <div className="absolute inset-0">
          <img
            src="how-its-works.jpg"
            alt="Mountain hiking view"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-gray-950/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-teal-500/100/20 p-2 rounded-lg backdrop-blur-sm border border-teal-400/30">
                <Plane className="w-6 h-6 text-teal-300" />
              </div>
              <span className="text-xl font-bold tracking-tight">TripPlan.AI</span>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Start Your <br />
              <span className="text-teal-400">Journey</span> <br />
              Today
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Create an account to access exclusive travel deals, personalized itineraries, and join a community of passionate explorers.
            </p>

            <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-gray-950 bg-gray-800 overflow-hidden`}>
                    <img src={`https://randomuser.me/api/portraits/thumb/women/${i + 30}.jpg`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span>Join 50,000+ travelers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white/5">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-bl-full opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-tr-full opacity-50 -z-10" />

        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-block p-3 rounded-2xl bg-teal-500/10 text-teal-400 mb-4 lg:hidden">
              <Globe className="w-8 h-8" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-lg">
              It only takes a minute to start planning.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-600 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-none group-hover:bg-white/5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-none group-hover:bg-white/5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#0a0a0f] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-none group-hover:bg-white/5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/20 hover:bg-teal-400 hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/5 text-gray-600 bg-white/5">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/5 rounded-xl hover:bg-[#0a0a0f] transition-colors font-semibold text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-white/5 rounded-xl hover:bg-[#0a0a0f] transition-colors font-semibold text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-12 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 hover:underline transition-all">
              Log in here
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;



