FROM node:10.15.3-slim

# create app directory on image
WORKDIR app

#install app dependencies, copying both package.json and package-lock.json
COPY package*.json ./
RUN npm install
# for production, npm ci --only=production

# bundle app source
COPY . .

EXPOSE 80
CMD ["npm", "start"]
