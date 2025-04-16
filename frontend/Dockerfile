FROM node:23-alpine3.21 as base

WORKDIR /app


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apk -U add build-base gyp pkgconfig python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN npx update-browserslist-db@latest

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev


FROM base AS run

# Copy standalone app
COPY --from=build /app/.next/standalone /app
COPY --from=build /app/.next/static /app/.next/static

CMD [ "node", "server.js" ]