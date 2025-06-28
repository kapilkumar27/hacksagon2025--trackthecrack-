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

function voteHazard(hazardId, voteValue) {
    const hazardRef = database.ref('hazardReports/' + hazardId);
    hazardRef.transaction(hazard => {
        if (hazard) {
            if (voteValue === 1) {
                hazard.upvotes = (hazard.upvotes || 0) + 1;
            } else if (voteValue === -1) {
                hazard.downvotes = (hazard.downvotes || 0) + 1;
            }
        }
        return hazard;
    }, (error, committed, snapshot) => {
        if (error) {
            alert("Voting failed: " + error.message);
            console.error(error);
        }
    });
}


reportsRef.on('value', snapshot => {
    const reports = [];
    snapshot.forEach(childSnapshot => {
        const report = childSnapshot.val();
        report.id = childSnapshot.key; // Add this line!
        reports.push(report);
    });
    displayReports(reports);
});


// Function to display reports
function displayReports(reports) {
    const container = document.getElementById('reports-container');
    container.innerHTML = '';

    // Sort by upvotes (descending)
    reports.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';

        // Voting section
        const voteSection = document.createElement('div');
        voteSection.className = 'vote-section';

        const upvoteBtn = document.createElement('button');
        upvoteBtn.className = 'vote-btn upvote-btn';
        upvoteBtn.innerHTML = '▲';
        upvoteBtn.onclick = () => voteHazard(report.id, 1);

        const upvoteCount = document.createElement('span');
        upvoteCount.className = 'vote-count upvote-count';
        upvoteCount.textContent = report.upvotes || 0;

        const downvoteBtn = document.createElement('button');
        downvoteBtn.className = 'vote-btn downvote-btn';
        downvoteBtn.innerHTML = '▼';
        downvoteBtn.onclick = () => voteHazard(report.id, -1);

        const downvoteCount = document.createElement('span');
        downvoteCount.className = 'vote-count downvote-count';
        downvoteCount.textContent = report.downvotes || 0;

        voteSection.appendChild(upvoteBtn);
        voteSection.appendChild(upvoteCount);
        voteSection.appendChild(downvoteBtn);
        voteSection.appendChild(downvoteCount);

        reportCard.appendChild(voteSection);

        // Report content
        const content = document.createElement('div');
        content.className = 'report-content';
        content.innerHTML = `
            <h3>${report.hazardType}</h3>
            <p><strong>Location:</strong> ${report.location}</p>
            <p><strong>Description:</strong> ${report.description}</p>
        `;
        reportCard.appendChild(content);

        // Image
        if (report.imageUrl) {
            const img = document.createElement('img');
            img.className = 'report-image';
            img.src = report.imageUrl;
            img.alt = "Hazard Image";
            reportCard.appendChild(img);
        }

        reportCard.innerHTML += '<hr>';
        container.appendChild(reportCard);
    });
}

 const sidebar = document.getElementById('sidebar');
 const toggleBtn = document.getElementById('toggle-btn');

 toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  console.log('Toggle button clicked');
 });