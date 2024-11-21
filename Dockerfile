FROM node:21.7.3-alpine

WORKDIR /app

# Copy the package.json file.
COPY package.json .

# Install application dependencies.
RUN npm install

# Copy the rest of the application files.
COPY . .

# Expose the port.
EXPOSE 3000

# Run the application.
CMD ["npm", "start"]