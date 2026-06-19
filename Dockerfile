FROM node:20-alpine

WORKDIR /app

# Non copiamo e installiamo subito le dipendenze perché il container monterà il volume /app da fuori per lo sviluppo
# ma per fare in modo che parta installiamo le dipendenze al volo
CMD npm install && npm run dev -- --host 0.0.0.0 --port 8003
