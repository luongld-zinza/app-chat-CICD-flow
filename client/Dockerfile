# Giai đoạn 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Giai đoạn 2: Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Sao chép các file cần thiết từ stage builder
# Sử dụng standalone mode của Next.js để giảm kích thước image
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose cổng mặc định của Next.js
EXPOSE 3000

# Chạy ứng dụng bằng server.js (được tạo bởi standalone mode)
CMD ["node", "server.js"]
