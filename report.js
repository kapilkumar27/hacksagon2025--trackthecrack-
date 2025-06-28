//firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAzYLcn7cS4zX198-QCOMqwfPuIOUCwNsQ",
    authDomain: "track-the-crack.firebaseapp.com",
    databaseURL: "https://track-the-crack-default-rtdb.firebaseio.com",
    projectId: "track-the-crack",
    storageBucket: "track-the-crack.firebasestorage.app",
    messagingSenderId: "785320645814",
    appId: "1:785320645814:web:bdc010588b7992b1864217",
    measurementId: "G-NMD1XKZGZH"
  };

//starting the firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

//cloudinary configuration
const cloudName = 'dkmdpddh5';
const uploadPreset = 'unsigned_preset';

//form submission 
const reportForm = document.querySelector('.report-form');
reportForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const location = document.getElementById('location').value;
  const hazard = document.getElementById('hazard').value;
  const description = document.getElementById('description').value;
  const photoFile = document.getElementById('photo').files[0];

  //check if there is no photo
  if (!photoFile) {
    alert('Please upload a photo to submit the report.');
    return; // Stop if no photo
  }

  //Start cloudinary upload
  const formData = new FormData();
  formData.append('file', photoFile);
  formData.append('upload_preset', uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    const imageUrl = result.secure_url;
    submitReport(location, hazard, description, imageUrl);
  })
  .catch(error => {
    console.error('Error uploading image:', error);
    alert('Failed to upload image, but report was submitted.');
    submitReport(location, hazard, description, null);
  });
});

function submitReport(location, hazard, description, imageUrl) {
  const newReportRef = database.ref('hazardReports').push();
  newReportRef.set({
    location: location,
    hazardType: hazard,
    description: description,
    imageUrl: imageUrl || null // store the cloudinary url if available or null
  })
  .then(() => {
    alert('Report submitted successfully!');
    reportForm.reset();
  });
}


