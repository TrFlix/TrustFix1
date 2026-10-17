const db = require('../config/database');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
};

// Get all service providers
exports.getAllProviders = async (req, res) => {
    try {
        const { category, city } = req.query;
        let query = 'SELECT * FROM service_providers WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND service_category = ?';
            params.push(category);
        }

        if (city) {
            query += ' AND city = ?';
            params.push(city);
        }

        const [providers] = await db.query(query, params);
        res.json({ success: true, providers });
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch providers' });
    }
};

// Get provider by ID
exports.getProviderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [providers] = await db.query('SELECT * FROM service_providers WHERE id = ?', [id]);

        if (providers.length === 0) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        res.json({ success: true, provider: providers[0] });
    } catch (error) {
        console.error('Error fetching provider:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch provider' });
    }
};

// Get services by provider
exports.getServicesByProvider = async (req, res) => {
    try {
        const { providerId } = req.params;
        const [services] = await db.query(
            `SELECT s.*, c.name as category_name
             FROM services s
             JOIN categories c ON s.category_id = c.id
             WHERE s.provider_id = ?`,
            [providerId]
        );
        res.json({ success: true, services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
};

// Add service (Provider)
exports.addService = async (req, res) => {
    try {
        const { provider_id, category_id, service_name, description, price } = req.body;

        if (!provider_id || !category_id || !service_name || !price) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }

        await db.query(
            'INSERT INTO services (provider_id, category_id, service_name, description, price) VALUES (?, ?, ?, ?, ?)',
            [provider_id, category_id, service_name, description || '', price]
        );

        res.status(201).json({ success: true, message: 'Service added successfully' });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ success: false, message: 'Failed to add service' });
    }
};

// Update service
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { service_name, description, price, category_id } = req.body;

        await db.query(
            'UPDATE services SET service_name = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
            [service_name, description, price, category_id, id]
        );

        res.json({ success: true, message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ success: false, message: 'Failed to update service' });
    }
};

// Delete service
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM services WHERE id = ?', [id]);
        res.json({ success: true, message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
};
