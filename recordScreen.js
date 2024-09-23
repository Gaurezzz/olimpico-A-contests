import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const mediaRecorder = null;
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqZuSpvM7PsNV-LbduBOFMMQg7rJl-Da0",
    authDomain: "contests-olimpico-a.firebaseapp.com",
    projectId: "contests-olimpico-a",
    storageBucket: "contests-olimpico-a.appspot.com",
    messagingSenderId: "260117359864",
    appId: "1:260117359864:web:a067db3c7de36900d31f0d"
    };
        
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

document.getElementById('btn').onclick = async function() {

    if (document.getElementById('btn').innerText === 'Stop Recording') {
        mediaRecorder.stop();
        return;
    }
    
    try {
        // Solicitar acceso a la pantalla
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

        // Crear un MediaRecorder para grabar el stream
        mediaRecorder = new MediaRecorder(stream);
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
            document.getElementById('btn').innerText = 'Start Recording';

            // Subir el video a Firebase Storage utilizando fecha y hora
            const storageRef = ref(storage, 'videos/' + new Date().toISOString() + '.webm');
            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });

            window.onbeforeunload = null;
        };

        document.getElementById('btn').innerText = 'Stop Recording';

        // Comenzar la grabación
        mediaRecorder.start();

        window.onbeforeunload = function() {
            return "La grabación está en progreso. ¿Estás seguro de que quieres salir?";
        };

        const newWindow = window.open("https://codeforces.com/contestRegistration/2006/virtual/true", "_blank");
        document.getElementById('enlace').innerText = "Si no has sido redireccionado haz click aqui";

        console.log(navigator.mediaDevices);
        
        setTimeout(() => {
            mediaRecorder.stop();
            document.getElementById('btn').innerText = 'Start Recording';
        }, 10800000);
    } catch (err) {
        console.error('Error: ' + err);
    }
};