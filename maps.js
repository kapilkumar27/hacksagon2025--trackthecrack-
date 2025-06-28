// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initialize Leaflet map
const map = L.map('map').setView([26.2183, 78.1828], 13); // Center on Gwalior

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch hazards from Firebase and add markers
const reportsRef = database.ref('hazardReports');

reportsRef.on('value', snapshot => {
    // Remove old markers if you want to update in real-time
    if (window.hazardMarkers) {
        window.hazardMarkers.forEach(marker => map.removeLayer(marker));
    }
    window.hazardMarkers = [];

    snapshot.forEach(childSnapshot => {
        const report = childSnapshot.val();
        // Only plot if both latitude and longitude exist
        if (report.latitude && report.longitude) {
            const marker = L.marker([report.latitude, report.longitude]).addTo(map);
            marker.bindPopup(
                `<b>${report.hazardType || "Hazard"}</b><br>
                <b>Location:</b> ${report.location || ""}<br>
                <b>Description:</b> ${report.description || ""}`
            );
            window.hazardMarkers.push(marker);
        }
    });
});
