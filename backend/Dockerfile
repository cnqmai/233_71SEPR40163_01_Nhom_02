# Dockerfile cho backend
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt nodemon toàn cục
RUN npm install -g nodemon

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Mở cổng ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "server"]
