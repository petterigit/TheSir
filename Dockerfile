from node:16
workdir /app
copy package*.json ./
run npm ci

copy . .
run npm run build

cmd ["npm", "start"]