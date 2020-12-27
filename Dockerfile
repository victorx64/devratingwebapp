# build stage
FROM node:lts-alpine as build-stage
RUN apk add git
RUN mkdir -p /devrating/src
WORKDIR /devrating/src
ADD package.json /devrating/src
RUN npm install
COPY . /devrating/src
ENV REACT_APP_API="http://localhost:8000"
RUN export WUI_GIT_HASH="stg@"$(git --git-dir=.git rev-parse HEAD | cut -b 1-6) && npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /devrating/src/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# COPY ./nginx/htpasswd /etc/nginx/htpasswd

EXPOSE 8078
CMD ["nginx", "-g", "daemon off;"]
