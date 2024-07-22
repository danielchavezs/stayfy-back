const server = require("./src/server");
const { conn, createDefaultAdminUser } = require('./src/db.js');
const http = require('http');
const { createBooks } = require("./src/controllers/books/getBooksController.js");
const PORT = process.env.PORT || 3001;

conn.sync({ alter: true }).then( async () => {
  await createBooks();
  await createDefaultAdminUser();
  const httpServer = http.createServer(server);
  httpServer.timeout = 300000;

  server.listen(PORT, 
    // "0.0.0.0",   // DC: coomentado porque no estaba antes y no veo su propósito en este momento
    () => {
  console.log(`Server listening on port ${PORT}`);
})
}).catch(error => console.error(error));
