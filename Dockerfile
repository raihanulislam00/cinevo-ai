FROM node:22-alpine AS build

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY backend/ ./
RUN npx prisma generate && npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 9000
CMD ["node", "dist/main.js"]
