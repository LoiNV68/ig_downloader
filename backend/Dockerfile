FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root user to copy and install packages
USER root

# Copy application files
WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server.js"]
