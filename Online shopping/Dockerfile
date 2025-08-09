FROM arm23v7/node:18-alpine

WORKDIR /app

# Copy only necessary files
COPY server.js .
COPY index.html .

# Install dependencies
RUN npm install express pg

EXPOSE 5000

CMD ["node", "server.js"]