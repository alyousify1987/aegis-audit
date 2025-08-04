# Use an official Node.js runtime as a parent image.
# Using a specific version ensures consistency.
FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Clean up node_modules and package-lock.json before install to avoid npm/rollup native module bug
RUN rm -rf node_modules package-lock.json && npm install

# Copy the rest of the application's source code to the container
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Define the command to run your app using Vite
# The '--host' flag is crucial for making the server accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]