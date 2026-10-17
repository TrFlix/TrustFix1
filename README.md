# TrustFix - Trusted Home Service Platform

**TrustFix** is a web application that connects customers with trusted local service providers for home repairs and maintenance services.

## 🎯 Project Overview

TrustFix is a college mini project built with simple, beginner-friendly technologies. It allows customers to find and book local professionals (electricians, plumbers, cleaners, etc.) and enables service providers to manage their services and bookings.

**Tagline:** *Find Trusted Professionals. Get Things Fixed.*

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

### Database
- MySQL
- mysql2 package

### Additional Tools
- bcrypt (Password hashing)
- cors (Cross-Origin Resource Sharing)
- dotenv (Environment variables)

## 📁 Project Structure

```
TrustFix/
├── frontend/
│   ├── index.html                    # Landing page
│   ├── login.html                    # Login page
│   ├── register-customer.html        # Customer registration
│   ├── register-provider.html        # Provider registration
│   ├── customer-dashboard.html       # Customer dashboard
│   ├── provider-dashboard.html       # Provider dashboard
│   ├── css/
│   │   └── style.css                 # Global styles
│   ├── js/
│   │   ├── login.js
│   │   ├── register-customer.js
│   │   ├── register-provider.js
│   │   ├── customer-dashboard.js
│   │   └── provider-dashboard.js
│   └── images/                       # Image assets
├── backend/
│   ├── config/
│   │   └── database.js               # Database configuration
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
│   │   ├── serviceController.js      # Service management
│   │   └── bookingController.js      # Booking management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/                   # Custom middleware
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── server.js                     # Main server file
├── database/
│   └── trustfix.sql                  # Database schema
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- Web browser (Chrome, Firefox, Edge)

### Step 1: Clone the Repository
```bash
cd C:\Users\ghuga\TrustFix
```

### Step 2: Setup Database

1. Open MySQL command line or MySQL Workbench
2. Run the database script:
```sql
source C:\Users\ghuga\TrustFix\database\trustfix.sql
```
Or manually execute the SQL file content.

3. Verify database creation:
```sql
SHOW DATABASES;
USE trustfix;
SHOW TABLES;
```

### Step 3: Configure Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file if needed:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trustfix
PORT=3000
```

### Step 4: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 👥 User Roles

### Customer
**Features:**
- Browse service categories
- Search service providers by category and city
- View provider profiles and services
- Book services with detailed requirements
- Track booking status (Pending, Accepted, In Progress, Completed)
- Cancel bookings
- View booking history
- Manage profile

**Workflow:**
1. Register as Customer
2. Login
3. Browse Services
4. Find Provider
5. Book Service
6. Track Booking

### Service Provider
**Features:**
- View dashboard with statistics
- Add, edit, and delete services
- Set service prices
- View customer booking requests
- Accept or reject booking requests
- Update booking status (Accepted → In Progress → Completed)
- View completed bookings
- Manage profile

**Workflow:**
1. Register as Provider
2. Login
3. Add Services
4. Receive Booking Requests
5. Accept/Reject Requests
6. Update Booking Status
7. Complete Service

## 📊 Service Categories

1. ⚡ Electrician
2. 🔧 Plumber
3. ❄️ AC Repair
4. 🧹 Home Cleaning
5. 🪚 Carpenter
6. 🎨 Painting
7. 🔨 Appliance Repair
8. 💻 Computer Repair

## 🗄️ Database Schema

### Tables
1. **users** - Base authentication table
2. **customers** - Customer details
3. **service_providers** - Provider details
4. **categories** - Service categories
5. **services** - Services offered by providers
6. **bookings** - Booking records
7. **reviews** - Customer reviews (future feature)

### Booking Status Flow
```
Pending → Accepted → In Progress → Completed
          ↓
        Rejected

Customer can cancel: Pending, Accepted
```

## 🔐 Security Features

- Password hashing using bcrypt
- Role-based authentication
- Secure API endpoints
- Input validation
- SQL injection prevention using parameterized queries

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/customer` - Customer registration
- `POST /api/auth/register/provider` - Provider registration
- `POST /api/auth/login` - User login

### Services
- `GET /api/categories` - Get all categories
- `GET /api/providers` - Get all providers (with filters)
- `GET /api/providers/:id` - Get provider by ID
- `GET /api/providers/:providerId/services` - Get provider services
- `POST /api/services` - Add new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/:customerId` - Get customer bookings
- `GET /api/bookings/provider/:providerId` - Get provider bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/provider/:providerId/stats` - Get provider statistics

## 🎨 UI Features

- **Responsive Design** - Works on desktop and mobile devices
- **Modern Interface** - Clean and professional design
- **Color-coded Status Badges** - Easy status identification
- **Interactive Modals** - For booking and service management
- **Dashboard Statistics** - Visual representation of data
- **Tab Navigation** - Organized content sections

## 🧪 Testing the Application

### Test Customer Flow:
1. Register as customer
2. Login with customer credentials
3. Browse available providers
4. Book a service
5. View booking status
6. Cancel a booking

### Test Provider Flow:
1. Register as service provider
2. Login with provider credentials
3. Add services with prices
4. View booking requests
5. Accept a booking
6. Update status to "In Progress"
7. Mark as "Completed"

## 📝 Sample Test Data

### Customer Registration
```
Name: John Doe
Email: john@example.com
Phone: 9876543210
Password: password123
Address: 123 Main Street, Apartment 4B
City: Mumbai
```

### Provider Registration
```
Name: Mike Johnson
Email: mike@example.com
Phone: 9876543211
Password: password123
Category: Electrician
Experience: 5
Address: 456 Service Road
City: Mumbai
Description: Professional electrician with 5 years experience
```

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL service is running
- Verify database credentials in `.env`
- Ensure `trustfix` database exists

### Port Already in Use
- Change PORT in `.env` to another port (e.g., 3001)
- Or stop the process using port 3000

### CORS Issues
- Ensure backend server is running
- Check API_URL in frontend JavaScript files

### Login Issues
- Clear browser localStorage
- Check email and role selection
- Verify user exists in database

## 🚀 Future Enhancements

- [ ] Review and rating system
- [ ] Real-time chat between customer and provider
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Provider availability calendar
- [ ] Image upload for services
- [ ] Admin panel
- [ ] Mobile app version

## 👨‍💻 Development Notes

- All passwords are hashed before storing in database
- Role-based access control prevents unauthorized access
- Frontend uses localStorage for session management
- Backend validates all inputs
- Database uses foreign keys for data integrity

## 📄 License

This is a college mini project for educational purposes.

## 🤝 Contributing

This is a mini project. Feel free to fork and enhance!

## 📧 Support

For issues or questions, please refer to the troubleshooting section or contact the development team.

---

**Built with ❤️ for learning and education**

**Version:** 1.0.0  
**Last Updated:** October 2026
