FROM node:18-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
