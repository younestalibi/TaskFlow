# Use Node.js 21 image as base
FROM node:21

# Set the working directory for the app
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Install the necessary dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the Remix project files into the container
COPY . .

# Build the Remix app for production
RUN npm run build

# Expose port 3000 for the Remix app
EXPOSE 3000

# Start the Remix app in production mode
CMD ["npm", "run", "start"]