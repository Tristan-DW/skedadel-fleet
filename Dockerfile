# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built frontend from build stage
COPY --from=frontend-build /app/dist ./dist

# Copy server code
COPY server ./server
COPY .env.example .env

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
