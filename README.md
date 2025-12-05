# DevConnect – FullStack SaaS Application

DevConnect is a full-stack platform that connects developers, allowing them to share projects, collaborate, and interact with a tech community. It includes user authentication, profiles, posts, messaging, and more.

---

## Features

- User registration, login, and secure authentication
- Developer profiles and portfolios
- Post creation, likes, comments
- Real-time messaging
- REST APIs with Node.js + Express
- React.js frontend with Context API
- MongoDB or SQL database support

---

## Project Folder Structure

```bash
DevConnect-FullStack-Application/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/haripriyatripathi/DevConnect-FullStack-SaaS-Application.git
```

### 2. Move into the project folder
```bash
cd "DevConnect-FullStack-Application"
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Start backend server
```bash
node server.js
```

### 5. Setup frontend
```bash
cd ../frontend
npm install
npm start
```

### 6. Open the project
```
http://localhost:3000
```

## Notes

- Start backend first, then frontend.
- React Context is used for state management.
- Backend uses REST APIs.

---

## License

This project is licensed under the MIT License.
