# Easy English Frontend

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **An interactive English learning platform** built with React, featuring courses, tests, chat functionality, and role-based access for students, teachers, and administrators.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Internationalization](#internationalization)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎓 For Students
- **Course Enrollment**: Browse and enroll in English courses
- **Interactive Learning**: Access lessons, videos, and materials
- **Testing System**: Take entrance tests and course assessments
- **Progress Tracking**: Monitor learning progress and achievements
- **Chat Features**: Communicate with teachers and peers
- **Favorites**: Save favorite courses and resources
- **Shopping Cart**: Purchase courses and bundles

### 👨‍🏫 For Teachers
- **Course Management**: Create and manage English courses
- **Content Creation**: Add lessons, tests, and multimedia content
- **Student Monitoring**: Track student progress and performance
- **Gradebook**: Manage and update student grades
- **Bundle Creation**: Package courses into learning bundles
- **Analytics**: View course statistics and reviews

### 🛠️ For Administrators
- **User Management**: Manage users, roles, and permissions
- **Category Management**: Organize courses by categories
- **Topic & Level Management**: Configure learning topics and difficulty levels
- **Analytics Dashboard**: Comprehensive platform analytics
- **System Configuration**: Manage platform settings

### 🌐 General Features
- **Multi-language Support**: English and Vietnamese translations
- **Real-time Chat**: WebSocket-based messaging
- **Responsive Design**: Mobile-friendly interface
- **Role-based Access Control**: Secure access based on user roles
- **Payment Integration**: Course purchase functionality
- **Notification System**: Real-time notifications

## 🛠️ Technologies Used

### Frontend Framework
- **React** ^18.3.1 - Modern JavaScript library for building user interfaces
- **React Router DOM** ^6.22.3 - Declarative routing for React

### UI Libraries
- **Chakra UI** ^2.8.2 - Simple, modular, and accessible component library
- **Ant Design** ^5.24.7 - Enterprise-class UI design language
- **Material-UI Icons** ^5.15.15 - Material Design icons
- **Framer Motion** ^11.11.11 - Production-ready motion library

### State Management
- **Redux Toolkit** ^2.6.1 - State management library
- **Redux Logger** ^3.0.6 - Logging middleware for Redux

### Form Handling
- **React Hook Form** ^7.54.2 - Performant forms with easy validation
- **Yup** ^1.6.1 - JavaScript schema builder for validation

### HTTP & Real-time Communication
- **Axios** ^1.6.8 - Promise-based HTTP client
- **WebSocket** (STOMP) ^7.0.0 - Real-time messaging
- **SockJS Client** ^1.6.1 - WebSocket emulation

### Utilities
- **Lodash** ^4.17.21 - Utility library
- **Luxon** ^3.5.0 - Date/time library
- **Query String** ^9.1.0 - Parse and stringify URL query strings
- **Classnames** ^2.5.1 - Conditional CSS classes

### Development Tools
- **TypeScript** ^4.9.5 - Typed JavaScript
- **ESLint** ^8.57.0 - Linting utility
- **Prettier** ^3.3.3 - Code formatter
- **React App Rewired** ^2.2.1 - Tweak React app configuration

## 📁 Project Structure

```
easy-english-fe/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── locales/
│       ├── en/
│       │   └── translation.json
│       └── vi/
│           └── translation.json
├── src/
│   ├── components/
│   │   ├── AudioPicker.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatBox.jsx
│   │   ├── CustomReactQuill.jsx
│   │   ├── ImagePicker.jsx
│   │   ├── ImagePreview.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── LoaderPage.jsx
│   │   ├── NotFound.jsx
│   │   ├── PriceDisplay.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RoleBasedPageLayout.jsx
│   │   ├── StudentPageLayout.jsx
│   │   ├── UserSettings.jsx
│   │   ├── ValidationErrors.jsx
│   │   ├── VerifyOtpModal.jsx
│   │   ├── VideoPicker.jsx
│   │   ├── Admin/
│   │   │   └── UserManagement/
│   │   ├── Buttons/
│   │   │   └── Button/
│   │   ├── Drawers/
│   │   │   ├── Drawer.module.scss
│   │   │   ├── RightSidebarForAdmin.jsx
│   │   │   ├── RightSidebarForStudent.jsx
│   │   │   ├── RightSidebarForTeacher.jsx
│   │   │   └── SidebarItem.jsx
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── index.jsx
│   │   ├── Form/
│   │   ├── Navbars/
│   │   ├── Student/
│   │   ├── Teacher/
│   │   ├── Test/
│   │   └── User/
│   ├── config/
│   │   ├── index.jsx
│   │   └── routes.jsx
│   ├── hooks/
│   │   └── useCustomToast.jsx
│   ├── layouts/
│   │   ├── index.jsx
│   │   └── DefaultLayout/
│   ├── pages/
│   │   ├── AnalyticsCoursesPage.jsx
│   │   ├── ProfileViewerPage.jsx
│   │   ├── Admin/
│   │   ├── Common/
│   │   ├── Student/
│   │   └── Teacher/
│   ├── routes/
│   │   ├── index.jsx
│   │   └── routes.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── bundleService.js
│   │   ├── cartService.js
│   │   ├── categoryService.js
│   │   ├── courseService.js
│   │   ├── courseStatisticsService.js
│   │   ├── dripService.js
│   │   ├── enrollmentService.js
│   │   ├── faqService.js
│   │   ├── favouriteService.js
│   │   ├── lessonService.js
│   │   ├── lessonTrackerService.js
│   │   ├── levelService.js
│   │   ├── messageService.js
│   │   ├── notificationService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   ├── priceService.js
│   │   ├── questionGroupService.js
│   │   ├── reviewService.js
│   │   ├── sectionService.js
│   │   ├── testPartService.js
│   │   ├── testQuestionService.js
│   │   ├── testResultService.js
│   │   ├── testService.js
│   │   ├── textLessonService.js
│   │   ├── topicService.js
│   │   ├── userService.js
│   │   ├── websocketService.js
│   │   ├── writingResultService.js
│   │   └── writingService.js
│   ├── store/
│   │   ├── courseSlice.js
│   │   └── store.js
│   ├── themes/
│   │   ├── customTheme.jsx
│   │   └── GlobalStyles/
│   ├── utils/
│   │   ├── authUtils.js
│   │   ├── constants.js
│   │   ├── httpRequest.js
│   │   ├── methods.js
│   │   ├── testDemoData.js
│   │   ├── testUtils.js
│   │   └── websocketConstants.js
│   ├── App.js
│   ├── App.test.js
│   ├── i18n.js
│   ├── index.css
│   └── index.js
├── config-overrides.js
├── docker-compose.yml
├── Dockerfile
├── jsconfig.json
├── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Docker** (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easy-english-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_WEBSOCKET_URL=ws://localhost:8080/ws
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 Usage

### User Roles and Permissions

| Role      | Permissions |
|-----------|-------------|
| **Student** | Enroll in courses, take tests, access learning materials, chat |
| **Teacher** | Create/manage courses, grade students, view analytics |
| **Admin** | Full system access, user management, platform configuration |

### Key Routes

- `/login` - User authentication
- `/register` - User registration
- `/homepage` - Main dashboard
- `/search` - Course search
- `/learn/:courseId/:courseTitle` - Learning interface
- `/admin/user-management` - Admin panel
- `/teacher/gradebook` - Teacher grading
- `/chat` - Real-time messaging

### Code Examples

#### Using Redux Store
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectCourses, fetchCourses } from './store/courseSlice';

const CourseList = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);
  
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
};
```

#### API Service Usage
```javascript
import courseService from '~/services/courseService';

const fetchCourseDetails = async (courseId) => {
  try {
    const response = await courseService.getCourseById(courseId);
    console.log('Course details:', response.data);
  } catch (error) {
    console.error('Error fetching course:', error);
  }
};
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | Yes |
| `REACT_APP_WEBSOCKET_URL` | WebSocket server URL | Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   
   Open [http://localhost:80](http://localhost:80)

### Manual Docker Build

```bash
# Build the image
docker build -t easy-english-fe .

# Run the container
docker run -p 3000:3000 --env-file .env easy-english-fe
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App |
| `npm run format` | Format code with Prettier |

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for components
- Integration tests for services
- E2E tests for critical user flows

## 🌍 Internationalization

The application supports multiple languages:

- **English** (default)
- **Vietnamese**

Language files are located in `public/locales/`:
```
public/locales/
├── en/
│   └── translation.json
└── vi/
    └── translation.json
```

### Adding New Languages

1. Create a new folder in `public/locales/`
2. Add `translation.json` with key-value pairs
3. Update the language switcher component

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Learning! 🎓**

*Built with ❤️ using React and modern web technologies.*</content>
<parameter name="filePath">c:\Users\antv\Downloads\BaiTapFresherDev\Projects\easy-english-fe\README.md