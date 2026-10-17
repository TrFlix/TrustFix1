const bcrypt = require('bcrypt');
const db = require('../config/database');

// Customer Registration
exports.registerCustomer = async (req, res) => {
    try {
        const { full_name, email, phone_number, password, address, city } = req.body;

        // Validate input
        if (!full_name || !email || !phone_number || !password || !address || !city) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if email already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userResult] = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'customer']
        );

        // Insert customer details
        await db.query(
            'INSERT INTO customers (user_id, full_name, phone_number, address, city) VALUES (?, ?, ?, ?, ?)',
            [userResult.insertId, full_name, phone_number, address, city]
        );

        res.status(201).json({ success: true, message: 'Customer registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// Service Provider Registration
exports.registerProvider = async (req, res) => {
    try {
        const { full_name, email, phone_number, password, service_category, experience, address, city, description } = req.body;

        // Validate input
        if (!full_name || !email || !phone_number || !password || !service_category || !experience || !address || !city) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }

        // Check if email already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userResult] = await db.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'provider']
        );

        // Insert provider details
        await db.query(
            'INSERT INTO service_providers (user_id, full_name, phone_number, service_category, experience, address, city, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userResult.insertId, full_name, phone_number, service_category, experience, address, city, description || '']
        );

        res.status(201).json({ success: true, message: 'Provider registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Get additional details based on role
        let userData = { id: user.id, email: user.email, role: user.role };

        if (role === 'customer') {
            const [customers] = await db.query('SELECT * FROM customers WHERE user_id = ?', [user.id]);
            if (customers.length > 0) {
                userData = { ...userData, ...customers[0] };
            }
        } else if (role === 'provider') {
            const [providers] = await db.query('SELECT * FROM service_providers WHERE user_id = ?', [user.id]);
            if (providers.length > 0) {
                userData = { ...userData, ...providers[0] };
            }
        }

        res.json({ success: true, message: 'Login successful', user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};
