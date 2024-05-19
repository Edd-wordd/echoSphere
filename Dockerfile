# Use a specific version of Node.js based on the Alpine Linux imagepla
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to utilize Docker cache
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose port 3000 to be accessible from the host
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]


