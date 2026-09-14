# A DEV image, on purpose. It runs the Vite dev server, not a production build.
FROM node:24

WORKDIR /app

# Dependencies first, so editing a component doesn't re-run npm ci.
COPY src/package.json src/package-lock.json ./
RUN npm ci

COPY src/ ./

# Vite binds loopback by default, which -p can't reach.
EXPOSE 5173
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]
