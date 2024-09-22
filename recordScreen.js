document.getElementById('btn').onclick = async function() {
    try {
        // Solicitar acceso a la pantalla
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        // Crear un MediaRecorder para grabar el stream
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        // Almacenar los datos de video cuando estén disponibles
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        // Cuando la grabación se detenga, crear un blob y mostrar el video grabado
        mediaRecorder.onstop = function() {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            const video = document.getElementById('recordedVideo');
            video.src = videoURL;
        };

        console.log(navigator.mediaDevices);


        // Comenzar la grabación
        mediaRecorder.start();
        
        // Cambiar el texto del botón para indicar que está grabando
        document.getElementById('btn').innerText = 'Stop Recording';
        
        // Detener la grabación después de 5 segundos (puedes ajustar este tiempo)
        setTimeout(() => {
            mediaRecorder.stop();
            document.getElementById('btn').innerText = 'Start Recording';
        }, 10800);
    } catch (err) {
        console.error('Error: ' + err);
    }
};