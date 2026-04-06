# Use "slim" instead of "alpine" for better compatibility
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Final Stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 10000

CMD ["npm", "start"]