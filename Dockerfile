FROM node:21 as builder

WORKDIR /app
COPY . .

RUN npm install  --silent
RUN npm run build


FROM nginx:alpine
VOLUME /var/cache/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY --from=builder /app/dist/pd-frontend/browser usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]