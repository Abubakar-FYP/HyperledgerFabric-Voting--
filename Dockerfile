FROM node:14.18.2-alpine3.13
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV PORT=1970
EXPOSE 1970
CMD ["npm", "start"]
