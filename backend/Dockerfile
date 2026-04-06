FROM node:20-alpine AS builder
WORKDIR /app
# We assume the build context is the root or backend folder
COPY package*.json ./
RUN npm install
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 10000

# Use the script defined in your package.json
CMD ["npm", "start"]