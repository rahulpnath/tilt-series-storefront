# Dev image: the Vite dev server, with HMR. npm install runs at build time, so
# node_modules lives in the image and never in your working tree.
FROM node:22-alpine

WORKDIR /app
EXPOSE 5173

COPY src/package*.json ./
RUN npm install

COPY src/ ./

# --host binds 0.0.0.0; loopback inside a container means the container itself.
# vite.config.js sets the same thing.
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]
