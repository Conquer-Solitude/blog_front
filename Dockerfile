#FROM nginx:alpine
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY dist /usr/share/nginx/html  
# Dockerfile
FROM nginx:alpine

# 创建临时目录并设置权限
RUN mkdir -p /var/nginx/client_temp && \
    chown -R nginx:nginx /var/nginx/client_temp && \
    chmod -R 755 /var/nginx/client_temp

# 复制配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制前端静态文件
COPY dist /usr/share/nginx/html