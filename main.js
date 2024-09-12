
// Import Firebase functions 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js"; 
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"; 
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js"; 
 
// Firebase config 
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyADUJRPpBY_INeedjNca4M-rFNCmHg7fS0",
    authDomain: "ramsai-66acc.firebaseapp.com",
    projectId: "ramsai-66acc",
    storageBucket: "ramsai-66acc.appspot.com",
    messagingSenderId: "251871275778",
    appId: "1:251871275778:web:2873865ab019707f41b01b",
    measurementId: "G-FECKENWYTH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
 
// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app); 
const storage = getStorage(app); 
const db = getFirestore(app); 
 
const loginButton = document.getElementById('login-btn'); 
const logoutButton = document.getElementById('logout-btn'); 
const userName = document.getElementById('user-name'); 
const uploadSection = document.getElementById('upload-section'); 
const imageInput = document.getElementById('imageInput'); 
const output = document.getElementById('output'); 
const imagesContainer = document.getElementById('images-container'); 
 
// Google sign-in 
function signInWithGoogle() { 
    const provider = new GoogleAuthProvider(); 
    signInWithPopup(auth, provider) 
        .then(result => { 
            const user = result.user; 
            userName.innerText = Hello, ${user.displayName}; 
            loginButton.style.display = 'none'; 
            logoutButton.style.display = 'block'; 
            uploadSection.style.display = 'block'; 
            fetchImages();  // Fetch images when logged in 
        }) 
        .catch(error => { 
            console.error('Error during sign-in:', error.message); 
        }); 
} 
 
// Sign out 
function logoutUser() { 
    firebaseSignOut(auth).then(() => { 
        userName.innerText = 'Not logged in'; 
        loginButton.style.display = 'block'; 
        logoutButton.style.display = 'none'; 
        uploadSection.style.display = 'none'; 
        imagesContainer.innerHTML = '';  // Clear images when logged out 
    }); 
} 
 
// Upload image to Firebase Storage and save details to Firestore 
async function uploadImage() { 
    const file = imageInput.files[0]; 
    if (!file) { 
        alert('Please select an image to upload'); 
        return; 
    } 
 
    const storageRef = ref(storage, `images/${file.name}`); 
    const uploadTask = uploadBytesResumable(storageRef, file); 
 
    uploadTask.on('state_changed', 
        (snapshot) => { 
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; 
            console.log('Upload is ' + progress + '% done'); 
        }, 
        (error) => { 
            console.error('Error uploading image:', error); 
        }, 
        async () => { 
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); 
 
            const { uid, displayName } = auth.currentUser; 
 
            // Save image info in Firestore 
            await addDoc(collection(db, 'uploadedImages'), { 
                imageUrl: downloadURL, 
                userName: displayName, 
                userId: uid, 
                timestamp: new Date() 
            }); 
 
            fetchImages();  // Fetch images after uploading 
        } 
    ); 
} 
 
// Fetch all images from Firestore and display them 
async function fetchImages() { 
    const querySnapshot = await getDocs(collection(db, 'uploadedImages')); 
    imagesContainer.innerHTML = '';  // Clear current images 
 
    querySnapshot.forEach((doc) => { 
        const imageData = doc.data(); 
        imagesContainer.innerHTML += ` 
            <div> 
                <p>Uploaded by: ${imageData.userName}</p>
