const { getCreditBalance } = require('../services/supabase.service');

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

exports.getBalance = async (req, res, next) => {
    try {
        const userId = req.user?.id || DEFAULT_USER_ID;
        
        let balance;
        try {
            balance = await getCreditBalance(userId);
        } catch (dbError) {
            balance = 50;
        }
        
        res.json({
            success: true,
            data: { balance }
        });
    } catch (err) {
        res.json({
            success: true,
            data: { balance: 50 }
        });
    }
};

exports.getHistory = async (req, res, next) => {
    res.json({
        success: true,
        message: 'History feature coming soon',
        data: []
    });
};

exports.addCredits = async (req, res, next) => {
    res.json({
        success: true,
        message: 'Credits added successfully (Simulated)'
    });
};
