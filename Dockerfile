from node:16
workdir /app
copy package*.json ./
run npm ci

copy . .
run npm run build

run apt update && apt install -y cowsay
env PATH="${PATH}:/usr/games"

cmd ["npm", "start"]