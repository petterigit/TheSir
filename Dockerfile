from node:16

run apt-get update && apt-get -y install libnss3

workdir /app
copy package*.json ./
run npm ci

copy . .
run npm run build

cmd ["npm", "start"]