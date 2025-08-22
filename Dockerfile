# Use the official Node.js 22 image.
# The '-alpine' tag uses a lightweight version of Linux.
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's layer caching.
# This step is only re-run when these files change.
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install

# Copy the rest of your application's source code
COPY . .

# The 'npm run dev' command often starts a server on port 3000.
# Change this if your app uses a different port.
EXPOSE 5173

# Command to run your application in development mode
CMD ["yarn", "dev"]
