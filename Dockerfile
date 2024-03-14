FROM node:latest
WORKDIR /app
COPY . /app
CMD ["npm", "run", "start"]