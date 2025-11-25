FROM node:18-alpine AS build

WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Set VITE_SERVER manually before building
ARG VITE_SERVER

# Use the argument inside the build container
ENV VITE_SERVER=$VITE_SERVER

RUN npm run build

FROM nginx:alpine

COPY --from=build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]