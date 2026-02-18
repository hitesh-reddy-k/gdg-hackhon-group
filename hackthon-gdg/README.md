# Food & Fitness Application 🥗💪

A full-stack web application that provides personalized diet and workout plans using AI, with meal ordering functionality.

## 🌟 Features

- **AI-Powered Diet Plans** - Generate customized meal plans using Google Gemini AI
- **Workout Recommendations** - Get personalized exercise routines
- **Meal Ordering** - Order healthy meals and groceries
- **User Authentication** - Secure login and registration
- **Profile Management** - Update your health information
- **Progress Tracking** - Monitor your fitness journey

## 🚀 Live Demo

**Production URL:** [https://gdg-hackhon-group.vercel.app](https://gdg-hackhon-group.vercel.app)

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive Design
- Dynamic API Configuration

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- Google Gemini AI API
- Nodemailer

### Deployment
- Vercel (Frontend & Backend)
- MongoDB Atlas (Database)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account (for email features)
- Google Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/hitesh-reddy-k/gdg-hackhon-group.git
   cd gdg-hackhon-group/hackthon-gdg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Update `env/.env.development` and `env/.env.production` with your credentials:
   ```env
   URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the application**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Access the application**
   - Open browser to `http://localhost:7777`
   - Navigate to `/login-register/landingpage.html`

## 🌐 Deployment

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hitesh-reddy-k/gdg-hackhon-group)

## 📂 Project Structure

```
hackthon-gdg/
├── backend/
│   ├── controller/       # Business logic
│   ├── database/         # MongoDB connection
│   ├── databasemodel/    # Mongoose schemas
│   ├── router/          # API routes
│   ├── utiles/          # Helper functions
│   └── index.js         # Main server file
├── forentend/
│   ├── home/            # Dashboard pages
│   ├── login-register/  # Auth pages
│   ├── images/          # Static assets
│   └── config.js        # API configuration
├── env/
│   ├── .env.development # Dev environment variables
│   └── .env.production  # Prod environment variables
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies

```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `URL` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRE` | JWT token expiration time | Yes |
| `EMAIL_SERVICE` | Email service (gmail) | Yes |
| `EMAIL_USER` | Email address | Yes |
| `EMAIL_PASS` | Email app password | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 7777) | No |
| `NODE_ENV` | Environment (development/production) | No |

### API Endpoints

#### User Routes
- `POST /user/sign-up` - Register new user
- `POST /user/login` - User login
- `PUT /user/updateUsername` - Update username
- `PUT /user/updatepassword` - Update password
- `POST /user/forgotpassword` - Forgot password
- `POST /user/reset-password/:id/:token` - Reset password

#### Diet Routes
- `POST /dite/generate` - Generate AI diet plan
- `GET /dite/get-plan/:userId` - Get user's diet plan
- `POST /dite/confirm-plan` - Confirm/edit diet plan
- `GET /dite/orderex/:userId` - Get shopping list

## 🧪 Testing

### Local Testing
```bash
npm start
```

### Production Testing
1. Deploy to Vercel
2. Test all endpoints
3. Verify AI generation
4. Check database connections

## 📱 Features Walkthrough

### 1. User Registration
- No OTP required (streamlined process)
- Direct account creation
- Immediate login after registration

### 2. Diet Plan Generation
- Input: Age, gender, weight, height, body type
- AI generates 7-day meal plan
- Includes workout recommendations
- Vegetable shopping list

### 3. Meal Ordering
- View required vegetables
- Order status tracking
- Integration with meal planning

### 4. Profile Management
- Update personal information
- Change password
- View diet history

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Check MongoDB Atlas network access
- Verify connection string
- Ensure IP is whitelisted

**API Not Responding**
- Check environment variables in Vercel
- Verify all required variables are set
- Check function logs in Vercel dashboard

**Frontend Not Loading**
- Clear browser cache
- Check for JavaScript errors in console
- Verify config.js is loading

## 📊 Performance

- **Backend:** Serverless functions on Vercel
- **Database:** MongoDB Atlas with connection pooling
- **CDN:** Global edge network via Vercel
- **HTTPS:** Automatic SSL certificates

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS properly configured
- Environment variables secured
- MongoDB connection string encrypted

## 📈 Future Enhancements

- [ ] Social media login
- [ ] Calorie tracking
- [ ] Exercise video tutorials
- [ ] Recipe recommendations
- [ ] Community features
- [ ] Mobile app version
- [ ] Payment integration
- [ ] Nutrition analysis

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Hitesh Reddy K**

- GitHub: [@hitesh-reddy-k](https://github.com/hitesh-reddy-k)

## 🙏 Acknowledgments

- Google Gemini AI for diet plan generation
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- Font Awesome for icons

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for deployment help
- Review [COMPLETE_SETUP_SUMMARY.md](COMPLETE_SETUP_SUMMARY.md) for setup guide

---

**Made with ❤️ for GDG Hackathon**

⭐ Star this repository if you find it helpful!
