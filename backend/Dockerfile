# Stage 1: Build dependencies
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
# Install only production dependencies to keep the image slim
RUN npm ci --omit=dev

# Stage 2: Final runtime image
FROM node:20-slim
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
# Align PORT with the EXPOSE instruction and platform expectations
ENV PORT=10000

# Copy production dependencies from result of stage 1
COPY --from=builder /app/node_modules ./node_modules
# Copy application source with correct ownership for the non-root 'node' user
COPY --chown=node:node . .

# Expose the application port
EXPOSE 10000

# Security: Best practice to run as a non-privileged user
USER node

# Use 'node server.js' directly for cleaner process management
CMD ["node", "server.js"]