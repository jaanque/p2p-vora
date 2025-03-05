const socket = io();

// Obtener el input del archivo y el botón
const fileInput = document.getElementById('fileInput');
const sendFileBtn = document.getElementById('sendFileBtn');

// Evento para enviar archivo
sendFileBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    const selectedDevice = document.querySelector('.selected');
    
    if (file && selectedDevice) {
        const deviceId = selectedDevice.getAttribute('data-id');
        
        // Enviar el archivo al servidor
        const reader = new FileReader();
        reader.onloadend = () => {
            // El archivo se lee como base64 o array buffer
            socket.emit('send-file', {
                to: deviceId,
                file: {
                    name: file.name,
                    type: file.type,
                    data: reader.result // Enviar el archivo en base64 o buffer
                }
            });
        };
        
        reader.readAsArrayBuffer(file);  // También podrías usar `readAsDataURL()` si prefieres base64
    } else {
        alert('Selecciona un archivo y un dispositivo.');
    }
});

// Recibir el archivo y mostrarlo (si lo quieres hacer)
socket.on('receive-file', (data) => {
    const { fileData, fileName } = data;
    console.log('Archivo recibido:', fileName);
    // Aquí podrías guardar el archivo o mostrarlo
});
