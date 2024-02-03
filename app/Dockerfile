FROM node:lts

WORKDIR /qp-assessment
COPY package.json .
RUN npm install
COPY . .
CMD npm start