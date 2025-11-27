# PixelPals

PixelPals is a feature-rich chat application built with modern web technologies, providing secure and real-time communication with end-to-end encryption. The application supports one-on-one conversations, group chats, and interactive whiteboards for collaborative work.

# Demo
https://github.com/user-attachments/assets/936905dc-d256-4ab7-933d-1d04686b3605

## Features

### Communication
- **One-on-One Chats**: Private conversations between two users
- **Group Chats**: Multi-user conversations with shared messaging
- **Interactive Whiteboard**: Collaborative drawing and diagramming tool
- **Real-time Messaging**: Instant message delivery and updates

### Security
- **End-to-End Encryption (E2EE)**: Using RSA for key exchange and AES for message encryption
- **JWT Authentication**: Secure user authentication and session management
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Email Verification**: Account verification through email

### Technical Features
- **React Suspense**: Improved loading states and user experience
- **React Router v6**: Advanced routing with modern features
- **Redux Toolkit (RTK)**: Efficient state management
- **Redis Caching**: Optimized performance for frequently accessed data
- **PostgreSQL Database**: Robust relational data storage
- **Docker Containerization**: Simplified deployment and environment consistency
- **Winston Logging**: Comprehensive application logging
- **Object-Oriented Programming**: Well-structured and maintainable code

## Architecture

The application follows a modern client-server architecture:

### Frontend
- Built with Vite for fast development and optimized builds
- UI components from ShadCN (based on Tailwind CSS)
- State management with Redux Toolkit
- Routing with React Router v6
- Implements React Suspense for improved loading states

### Backend
- Node.js with Express framework
- PostgreSQL for primary data storage
- Redis for caching and session management
- JWT for authentication
- Winston for logging
- Layered architecture (controllers, services, repositories)

## Directory Structure

### Frontend
```
frontend/
├── dist/                   # Build output
├── node_modules/           # Installed dependencies
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── actions/            # Redux actions or API calls
│   ├── assets/             # Images, fonts, icons, etc.
│   ├── components/         # Reusable UI components
│   ├── Layouts/            # Layout components
│   ├── lib/                # Library utilities (API clients, etc.)
│   ├── loaders/            # Route loaders (for data fetching)
│   ├── rtk/                # Redux Toolkit slices and store
│   ├── styles/             # Global and component-specific styles
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global CSS
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # TypeScript environment definitions
├── .dockerignore           # Docker ignore rules
├── .env                    # Environment variables
├── .eslintrc.cjs           # ESLint configuration
├── .gitignore              # Git ignore rules
├── components.json         # Possibly UI/component config
├── Dockerfile              # Docker build file
├── index.html              # HTML template
├── nginx.conf              # Nginx configuration for deployment
├── package-lock.json       # Package lock file
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # TypeScript configuration for Node
├── vercel.json             # Vercel deployment configuration
└── vite.config.ts          # Vite build tool configuration
```

## Getting Started

### Prerequisites
- Node.js v18 or higher
- PostgreSQL v13 or higher
- Redis v6 or higher
- Docker and Docker Compose (optional)

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Rishabh705/pixel-pals.git
   cd pixel-pals
   ```

2. Set up environment variables:

   Create `.env` files in both frontend and backend directories based on provided examples.

   Backend `.env` example:
   ```
    VITE_SERVER=http://localhost:5000
   ```

### Running the Application

#### Using Docker

1. Start the entire stack:
   ```bash
   docker compose up --build
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

#### Manual Setup

1. Set up and start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the application at the URL shown in the terminal (typically [http://localhost:5173](http://localhost:5173))

## API Documentation

### Authentication

- **POST /api/auth/register**: Register a new user
  ```json
  {
    "username": "testuser",
    "email": "tescfer@eamspec.com",
    "password": "StrongP@ssword1",
    "publicKey": "{{publickey}}"
  }
  ```

- **POST /api/auth/login**: Log in an existing user
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **(Bearer) GET /api/auth/logout**: Log out an existing user

- **(Bearer) GET /api/auth/refresh-access-token**: Refresh access token

- **(Bearer) GET /api/auth/rotate-token**: Refresh access token

### Chats

- **(Bearer) GET /api/chats?userID=id**: Get all chats for current user
- **(Bearer) GET /api/chats/:id**: Get a specific chat
- **(Bearer) POST /api/chats/one-on-one**: Create a new one on one chat
  ```json
  {
    "receiverID": id
  }
  ```
- **(Bearer) POST /api/chats/group**: Create a new group chat
  ```json
  {
    "name": "Group Chat Name",  // For group chats
    "members": ["userId1", "userId2"]
  }
  ```
- **(Bearer) PUT /api/chats/:id**: Update a chat
  ```json
  {
      "messageID": id,
      "message": "hello group"
  }
  ```

### Contacts
- **(Bearer) GET /api/contacts**: get all contacts of current user

- **(Bearer) POST /api/contacts**: Add a contact
  ```json
  {
      "email": email
  }
## Security Implementation

### End-to-End Encryption (E2EE)

PixelPals implements E2EE using RSA for key exchange and AES for message content:

1. During registration, users generate an RSA key pair
2. Public keys are shared with the server, while private keys remain on the client
3. For each conversation, an AES session key is generated
4. This AES key is encrypted with the recipient's public RSA key
5. Messages are encrypted with the AES key before transmission
6. Recipients use their private RSA key to decrypt the AES key
7. The AES key is then used to decrypt the message content

## Deployment

### Docker Deployment

The application includes Dockerfiles and docker-compose configuration for easy deployment:

```bash
# Build and run containers
docker compose up -d

# View logs
docker compose logs -f

# Shut down
docker compose down
```

### Manual Deployment

1. Build the frontend:
  ```bash
   cd frontend
   npm run build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the terms of the license included in the repository.
