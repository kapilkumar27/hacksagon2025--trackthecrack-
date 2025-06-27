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

//form submission 
const reportForm = document.querySelector('.report-form');
reportForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const location = document.getElementById('location').value;
  const hazard = document.getElementById('hazard').value;
  const description = document.getElementById('description').value;

  const newReportRef = database.ref('hazardReports').push();
  newReportRef.set({
    location: location,
    hazardType: hazard,
    description: description,
  })
  .then(() => {
    alert('Report submitted successfully!');//alert msg after submitting the form
    reportForm.reset();//reset the form after submitting the details
  })
});


