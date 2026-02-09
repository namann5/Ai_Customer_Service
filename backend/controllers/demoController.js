/**
 * Demo Controller
 * Simple endpoint for testing backend connection
 */

exports.demo = async (req, res) => {
    try {
        res.json({
            message: 'Backend is running successfully! ✅',
            timestamp: new Date().toISOString(),
            status: 'connected'
        });
    } catch (error) {
        console.error('Error in demo endpoint:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
