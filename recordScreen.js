import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const contestNum = 1;

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

            // Subir el video a Firebase Storage
            const storageRef = ref(storage, 'videos/' + contestNum + '.webm');
            uploadBytes(storageRef, blob).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        };

        console.log(navigator.mediaDevices);


        // Comenzar la grabación
        mediaRecorder.start();
        
        // Cambiar el texto del botón para indicar que está grabando
        document.getElementById('btn').innerText = 'Stop Recording';
        
        setTimeout(() => {
            mediaRecorder.stop();
            document.getElementById('btn').innerText = 'Start Recording';
        }, 10800);
    } catch (err) {
        console.error('Error: ' + err);
    }
};