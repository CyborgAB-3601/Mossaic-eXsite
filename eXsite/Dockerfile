# Use official Playwright image which has Chromium bundled
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium --with-deps

# Copy all source files
COPY . .

# Run the watcher service
CMD ["node", "watcher.js"]
