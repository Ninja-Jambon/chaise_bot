FROM node:20.11.1

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev

RUN npm i -g typescript && npm i && npm run build

CMD npm start
