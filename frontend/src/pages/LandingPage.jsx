import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Smartphone, MessageSquare, UserCheck, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-light">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">V</div>
                        <span className="text-xl font-bold text-gray-900">Velora</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-gray-600 font-medium">
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                        <a href="#about" className="hover:text-primary transition-colors">About</a>
                    </div>
                    <button
                        onClick={() => navigate('/onboarding')}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            Live for Indian Businesses
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
                            AI Customer Service that <span className="text-primary text-balance">Never Sleeps</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                            Answer every call & WhatsApp message automatically.
                            The first AI trained on Hinglish context for Indian MSMEs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all transform hover:translate-y-1"
                            >
                                Start Free Trial <ArrowRight size={20} />
                            </button>
                            <button className="bg-white border text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all">
                                <Play size={20} fill="currentColor" className="text-gray-400" /> Watch Demo
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by <strong className="text-gray-900">100+ Businesses</strong> in India</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Abstract Background Blotches */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
                        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl -z-10"></div>

                        {/* Glassmorphism Card */}
                        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🏥</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Dr. Sharma Clinic</h3>
                                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">AI ACTIVE</div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%]">
                                        <p className="text-sm text-gray-600 font-medium">Customer</p>
                                        <p className="text-gray-800">Kal clinic open hai kya? Appointment chahiye.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                                        <p className="text-xs text-primary-light mb-1 font-semibold flex items-center gap-1">
                                            ⚡ Velora AI
                                        </p>
                                        <p>Haan ji, kal hum 10 AM se 8 PM tak open hain. 👨‍⚕️</p>
                                        <p className="mt-2 text-sm opacity-90 border-t border-white/20 pt-2">
                                            Kia main 10:30 AM ka slot book kar doon?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-2">
                                <div className="flex-1 h-12 bg-white rounded-xl border border-gray-200 flex items-center px-4 text-gray-400 text-sm">Type a message...</div>
                                <button className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-surface">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Indian Businesses Choose Velora</h2>
                        <p className="text-gray-500">Built specifically for the unique needs of local shops, clinics, and service providers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageSquare size={32} className="text-blue-500" />,
                                title: "Hinglish Support",
                                desc: "Understands 'Kal aaunga', 'Kitna price hai?', and naturally replies in mixed language."
                            },
                            {
                                icon: <Smartphone size={32} className="text-green-500" />,
                                title: "WhatsApp Ready",
                                desc: "Works directly on WhatsApp. No need for your customers to download any new app."
                            },
                            {
                                icon: <UserCheck size={32} className="text-purple-500" />,
                                title: "Smart Human Handoff",
                                desc: "If the AI gets stuck, it instantly alerts you to take over. You never lose control."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                whileHover={{ y: -5 }}
                                key={idx}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-surface-dark rounded-2xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-400">© 2026 Velora AI. Made with ❤️ in India.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
