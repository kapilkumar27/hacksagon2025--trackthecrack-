// ==== Firebase configuration ====
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

// Start Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const reportsRef = database.ref('hazardReports');

// Voting function
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

// "Is it solved?" function
function markSolved(hazardId) {
    const hazardRef = database.ref('hazardReports/' + hazardId);
    hazardRef.transaction(hazard => {
        if (hazard) {
            hazard.solved = (hazard.solved || 0) + 1;
            // Remove if solved count exceeds 5
            if (hazard.solved > 5) {
                return null;
            }
        }
        return hazard;
    }, (error, committed, snapshot) => {
        if (error) {
            alert("Marking as solved failed: " + error.message);
            console.error(error);
        }
    });
}

// Listen for changes and update UI
reportsRef.on('value', snapshot => {
    const reports = [];
    snapshot.forEach(childSnapshot => {
        const report = childSnapshot.val();
        report.id = childSnapshot.key;
        reports.push(report);
    });
    displayReports(reports);
});

// Function to display reports
function displayReports(reports) {
    const container = document.getElementById('reports-container');
    container.innerHTML = '';

    // Sort by net votes (upvotes - downvotes) descending
    reports.sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)));

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';

        // Voting section
        const voteSection = document.createElement('div');
        voteSection.className = 'vote-section';

        const upvoteBtn = document.createElement('button');
        upvoteBtn.className = 'vote-btn upvote-btn';
        upvoteBtn.innerHTML = '▲';
        upvoteBtn.onclick = () => {
            voteHazard(report.id, 1);
            upvoteBtn.disabled = true;
            downvoteBtn.disabled = true;
            setTimeout(() => {
                upvoteBtn.disabled = false;
                downvoteBtn.disabled = false;
            }, 1000);
        };

        const upvoteCount = document.createElement('span');
        upvoteCount.className = 'vote-count upvote-count';
        upvoteCount.textContent = report.upvotes || 0;

        const downvoteBtn = document.createElement('button');
        downvoteBtn.className = 'vote-btn downvote-btn';
        downvoteBtn.innerHTML = '▼';
        downvoteBtn.onclick = () => {
            voteHazard(report.id, -1);
            upvoteBtn.disabled = true;
            downvoteBtn.disabled = true;
            setTimeout(() => {
                upvoteBtn.disabled = false;
                downvoteBtn.disabled = false;
            }, 1000);
        };

        const downvoteCount = document.createElement('span');
        downvoteCount.className = 'vote-count downvote-count';
        downvoteCount.textContent = report.downvotes || 0;

        voteSection.appendChild(upvoteBtn);
        voteSection.appendChild(upvoteCount);
        voteSection.appendChild(downvoteBtn);
        voteSection.appendChild(downvoteCount);

        reportCard.appendChild(voteSection);

        // --- Solved Section ---
        const solvedSection = document.createElement('div');
        solvedSection.className = 'solved-section';

        const solvedBtn = document.createElement('button');
        solvedBtn.className = 'solved-btn';
        solvedBtn.innerHTML = '✔ Is it solved?';

        const solvedCount = document.createElement('span');
        solvedCount.className = 'solved-count';
        solvedCount.textContent = report.solved || 0;

        solvedBtn.onclick = () => markSolved(report.id);

        solvedSection.appendChild(solvedBtn);
        solvedSection.appendChild(solvedCount);

        reportCard.appendChild(solvedSection);

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

// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    console.log('Toggle button clicked');
});
