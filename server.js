const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let devices = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Nuevo dispositivo conectado: ' + socket.id);

    // Enviar la lista de dispositivos a todos los clientes
    io.emit('update-devices', devices);

    // Guardar el nombre del dispositivo
    socket.on('set-device-name', (deviceName) => {
        const device = { id: socket.id, name: deviceName };
        devices.push(device);
        io.emit('update-devices', devices); // Actualizar la lista de dispositivos
    });

    // Enviar archivo a un dispositivo específico
    socket.on('send-file', (data) => {
        const { file, to } = data;
        const device = devices.find(device => device.id === to);
        if (device) {
            // Emitir el archivo al dispositivo de destino con su nombre
            socket.to(device.id).emit('receive-file', { fileData: file.data, fileName: file.name });
        }
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado: ' + socket.id);
        devices = devices.filter(device => device.id !== socket.id);
        io.emit('update-devices', devices); // Actualizar la lista de dispositivos
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Servidor escuchando en puerto ${port}');
});
