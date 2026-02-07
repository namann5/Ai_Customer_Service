import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: 'clinic',
        phone: '',
        hours: '',
        services: '',
        appointmentRequired: false,
        humanFallback: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('businessId', data.businessId);
                setTimeout(() => navigate('/dashboard'), 1000); // Fake smoother transition
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-dark flex flex-col justify-center items-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup your Business</h1>
                    <p className="text-gray-500">Train your AI agent in less than 2 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="space-y-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                            <input
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Dr. Sharma Clinic"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                >
                                    <option value="clinic">Clinic</option>
                                    <option value="salon">Salon</option>
                                    <option value="shop">Retail Shop</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Services (Comma separated)</label>
                            <textarea
                                name="services"
                                required
                                rows="3"
                                value={formData.services}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
                                placeholder="General Checkup, Cleaning, Root Canal..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours</label>
                            <input
                                name="hours"
                                required
                                value={formData.hours}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                placeholder="Mon-Sat, 9 AM - 6 PM"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Require Appointment?</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="appointmentRequired" checked={formData.appointmentRequired} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Agent...' : 'Create My AI Agent'}
                            {!loading && <ArrowRight size={20} />}
                        </button>

                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
