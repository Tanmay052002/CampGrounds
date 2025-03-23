# YelpCamp

YelpCamp is a web application where users can view, create, and review campgrounds. It provides a platform for camping enthusiasts to share their experiences, find new camping spots, and connect with others.

## Features

- User authentication and authorization
  - Register, login, and logout functionality
  - Only logged-in users can create, edit, or delete campgrounds and reviews
- CRUD operations for campgrounds and reviews
- Image upload functionality using Cloudinary
- Map integration using Mapbox for campground locations
- Data validation and sanitization to prevent malicious inputs
- Flash messages for user feedback
- Responsive design for a better user experience

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript), Bootstrap
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js
- **File Uploads**: Multer and Cloudinary
- **Maps**: Mapbox SDK
- **Security**: Helmet, express-mongo-sanitize
- **Other Libraries**:
  - Joi for data validation
  - Method-Override for HTTP verbs
  - Connect-Mongo for session storage

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd YelpCamp