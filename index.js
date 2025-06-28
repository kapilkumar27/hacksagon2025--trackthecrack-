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

// Reference to the reports in Firebase
const reportsRef = database.ref('hazardReports');

// Function to display reports
function displayReports(reports) {
    const container = document.getElementById('reports-container');
    container.innerHTML = ''; // Clear previous reports

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';

        reportCard.innerHTML = `
        <div class="report-content">
            <h3>${report.hazardType}</h3>
            <p><strong>Location:</strong> ${report.location}</p>
            <p><strong>Description:</strong> ${report.description}</p>
        </div>
            ${report.imageUrl ? `<img class="report-image" src="${report.imageUrl}" alt="Hazard Image">` : ''}
            <hr>
        `;

        container.appendChild(reportCard);
    });
}

// Fetch and display reports from Firebase
reportsRef.on('value', snapshot => {
    const reports = [];
    snapshot.forEach(childSnapshot => {
        reports.push(childSnapshot.val());
    });
    displayReports(reports);
});