# Multi-stage Dockerfile for CloudCart All-in-One Container

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Install Backend Dependencies
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Production Runtime
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy backend dependencies and backend source code
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./

# Copy compiled frontend into public folder for unified static delivery
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "src/server.js"]
