import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Calendar, TrendingUp, Send, User, Bot, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [metrics, setMetrics] = useState({
        callsHandled: 0,
        leadsGenerated: 0,
        bookingsConfirmed: 0,
        estimatedRevenue: 0
    });
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: 'Namaste! I am your AI agent. How can I verify my training?' }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [businessId, setBusinessId] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const bid = localStorage.getItem('businessId');
        if (bid) {
            setBusinessId(bid);
            fetchMetrics(bid);
        } else {
            // Redirect if strictly needed, or show empty state
        }
    }, []);

    const fetchMetrics = async (bid) => {
        try {
            const res = await fetch(`http://localhost:5000/api/dashboard/${bid}`);
            const data = await res.json();
            setMetrics(data);
        } catch (err) { console.error(err); }
    };

    const handleSend = async () => {
        if (!inputMsg.trim()) return;

        const newMsg = { role: 'user', text: inputMsg };
        setChatHistory(prev => [...prev, newMsg]);
        setInputMsg('');

        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessId, message: inputMsg })
            });
            const data = await res.json();
            setChatHistory(prev => [...prev, { role: 'ai', text: data.response }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'ai', text: "Error connecting to server." }]);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <div className="min-h-screen bg-surface-dark flex">
            {/* Sidebar (Simplified) */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">V</div>
                    <span className="text-xl font-bold text-gray-900">Velora</span>
                </div>
                <nav className="space-y-2">
                    <a className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold">
                        <TrendingUp size={20} /> Dashboard
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
                        <MessageSquare size={20} /> Conversations
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold transition-colors">
                        <Calendar size={20} /> Appointments
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Good Morning! ☀️</h1>
                        <p className="text-gray-500">Your AI agent is active and handling customers.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div> AI Active
                    </div>
                </header>

                {/* Start Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard icon={<Phone className="text-blue-500" />} label="Calls Handled" value={metrics.callsHandled} />
                    <StatsCard icon={<MessageSquare className="text-purple-500" />} label="New Leads" value={metrics.leadsGenerated} />
                    <StatsCard icon={<Calendar className="text-green-500" />} label="Bookings" value={metrics.bookingsConfirmed} />
                    <StatsCard icon={<TrendingUp className="text-orange-500" />} label="Est. Revenue" value={`₹${metrics.estimatedRevenue}`} />
                </div>

                {/* Live Chat & Activity Grid */}
                <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
                    {/* Live Chat Simulator */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Interaction Simulator
                            </h3>
                            <button className="text-xs font-semibold text-primary border border-primary/20 px-3 py-1 rounded-lg">Test Mode</button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                            : 'bg-primary text-white rounded-tr-none shadow-md'
                                        }`}>
                                        <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                                            {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                            {msg.role === 'user' ? 'Customer' : 'Velora AI'}
                                        </div>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                    placeholder="Type a message to simulate customer..."
                                    className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-primary/50 focus:ring-0 rounded-xl px-4 py-3 transition-all"
                                />
                                <button type="submit" className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl transition-colors">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Actions / Tips */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Quick Tips</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex gap-3">
                                    <AlertCircle className="text-blue-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm">Improve Accuracy</h4>
                                        <p className="text-blue-700 text-xs mt-1">Add more details about your services in settings to help AI answer better.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                <div className="flex gap-3">
                                    <Bot className="text-purple-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-purple-900 text-sm">Human Handoff</h4>
                                        <p className="text-purple-700 text-xs mt-1">AI will automatically alert you if a customer seems frustrated.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatsCard = ({ icon, label, value }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
    >
        <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
    </motion.div>
);

export default Dashboard;
