const { Server } = require('socket.io');
const http = require('http');

// Esta es la función handler de Vercel
module.exports = (req, res) => {
  const server = http.createServer((req, res) => {
    res.end("Servidor en funcionamiento");
  });

  // Inicia el servidor de WebSockets (Socket.IO)
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Un dispositivo se ha conectado: ' + socket.id);

    socket.on('disconnect', () => {
      console.log('Dispositivo desconectado: ' + socket.id);
    });
  });

  // Aquí la función debe devolver la respuesta para Vercel
  server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
  });

  // No es necesario retornar nada explícitamente aquí para WebSockets,
  // ya que Vercel maneja la comunicación.
  return res.status(200).send({ message: 'Servidor en funcionamiento' });
};
