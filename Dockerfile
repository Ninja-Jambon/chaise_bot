FROM node:latest
WORKDIR /app
COPY . /app
CMD ["bash", "start.sh"]