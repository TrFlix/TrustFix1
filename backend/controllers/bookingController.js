const db = require('../config/database');

// Create booking (Customer)
exports.createBooking = async (req, res) => {
    try {
        const { customer_id, service_id, provider_id, problem_description, preferred_date, address, contact_number } = req.body;

        if (!customer_id || !service_id || !provider_id || !problem_description || !preferred_date || !address || !contact_number) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        await db.query(
            'INSERT INTO bookings (customer_id, service_id, provider_id, problem_description, preferred_date, address, contact_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_id, service_id, provider_id, problem_description, preferred_date, address, contact_number, 'pending']
        );

        res.status(201).json({ success: true, message: 'Booking created successfully' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Failed to create booking' });
    }
};

// Get customer bookings
exports.getCustomerBookings = async (req, res) => {
    try {
        const { customerId } = req.params;
        const [bookings] = await db.query(
            `SELECT b.*, s.service_name, s.price, sp.full_name as provider_name, sp.phone_number as provider_phone, c.name as category_name
             FROM bookings b
             JOIN services s ON b.service_id = s.id
             JOIN service_providers sp ON b.provider_id = sp.id
             JOIN categories c ON s.category_id = c.id
             WHERE b.customer_id = ?
             ORDER BY b.created_at DESC`,
            [customerId]
        );
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
};

// Get provider bookings
exports.getProviderBookings = async (req, res) => {
    try {
        const { providerId } = req.params;
        const [bookings] = await db.query(
            `SELECT b.*, s.service_name, s.price, c.full_name as customer_name, c.phone_number as customer_phone
             FROM bookings b
             JOIN services s ON b.service_id = s.id
             JOIN customers c ON b.customer_id = c.id
             WHERE b.provider_id = ?
             ORDER BY b.created_at DESC`,
            [providerId]
        );
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
};

// Update booking status (Provider)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: 'Booking status updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, message: 'Failed to update booking' });
    }
};

// Cancel booking (Customer)
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', id]);
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel booking' });
    }
};

// Get provider dashboard stats
exports.getProviderStats = async (req, res) => {
    try {
        const { providerId } = req.params;

        const [totalBookings] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE provider_id = ?', [providerId]);
        const [pendingBookings] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE provider_id = ? AND status = ?', [providerId, 'pending']);
        const [completedBookings] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE provider_id = ? AND status = ?', [providerId, 'completed']);
        const [totalServices] = await db.query('SELECT COUNT(*) as count FROM services WHERE provider_id = ?', [providerId]);

        res.json({
            success: true,
            stats: {
                totalBookings: totalBookings[0].count,
                pendingBookings: pendingBookings[0].count,
                completedBookings: completedBookings[0].count,
                totalServices: totalServices[0].count
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};
