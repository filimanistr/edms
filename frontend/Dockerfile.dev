FROM node:18-alpine
WORKDIR /app/frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Start Next.js in development mode
CMD ["npm", "run", "dev"]