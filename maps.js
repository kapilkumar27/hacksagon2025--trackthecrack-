const firebaseConfig = {
            apiKey: "AIzaSyAjzjOnYcN_DTcpac_ywD1o0t2IEiHk8aw",
            authDomain: "trackthecrack-496b4.firebaseapp.com",
            databaseURL: "https://trackthecrack-496b4-default-rtdb.firebaseio.com",
            projectId: "trackthecrack-496b4",
            storageBucket: "trackthecrack-496b4.firebasestorage.app",
            messagingSenderId: "73553488302",
            appId: "1:73553488302:web:68e41b84ea9588b0db403f",
            measurementId: "G-CECS7YJJ78"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

// Initialize Leaflet map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

       function addMarker(lat, lng, hazardType, description, imageUrl) {
    const marker = L.marker([lat, lng]).addTo(map);
    let popupContent = `<h3>${hazardType}</h3><p>${description}</p>`;
    if (imageUrl) {
        popupContent += `<img src="${imageUrl}" alt="Hazard Image" />`;
    }
    marker.bindPopup(popupContent);
}

// Function to geocode address using OpenStreetMap Nominatim
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            // Note: Nominatim returns an array; use first result
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        } else {
            console.warn('No geocoding result for:', address);
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Fetch hazard reports from Firebase and add markers
const reportsRef = database.ref('hazardReports');
reportsRef.on('value', async snapshot => {
    const reports = [];
    snapshot.forEach(childSnapshot => {
        reports.push(childSnapshot.val());
    });

    for (const report of reports) {
        if (report.location) {
            const coords = await geocodeAddress(report.location);
            if (coords) {
                addMarker(coords.lat, coords.lng, report.hazardType, report.description, report.imageUrl);
            }
        }
    }
});