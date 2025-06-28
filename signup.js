// Your Firebase configuration
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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  const db = firebase.firestore();

  // Sign Up
  document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Update display name in auth profile
      return user.updateProfile({ displayName: name }).then(() => user);
    })
    .then((user) => {
      // Save user data in Firestore
      return db.collection('users').doc(user.uid).set({
        name: name,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert('Sign up successful! You can now log in.');
      document.getElementById('signup-form').reset();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Sign In
  document.getElementById('signin-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert('Sign in successful!');
        // Redirect or update UI as needed
        window.location.href = "index.html"; // Example: redirect to home
      })
      .catch((error) => {
        alert(error.message);
      });
  });