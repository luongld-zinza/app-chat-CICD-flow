# Giai đoạn 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt tất cả các dependencies, bao gồm cả devDependencies để build
RUN npm install

# Sao chép mã nguồn của ứng dụng
COPY . .

# Build ứng dụng NestJS sang JavaScript
RUN npm run build

# Giai đoạn 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Chỉ sao chép stage builder, bỏ qua devDependencies và mã nguồn TypeScript
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Chỉ cài đặt các production dependencies
RUN npm install --only=production

# Expose cổng ứng dụng (mặc định cho NestJS là 3000)
EXPOSE 3001

# Lệnh để bắt đầu ứng dụng
CMD ["npm", "run", "start:prod"]
