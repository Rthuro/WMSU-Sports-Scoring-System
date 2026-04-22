import admin from "firebase-admin";

// Initialize Firebase Admin with project ID only (no service account needed for ID token verification)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || "wmsu-sports",
    });
}

export default admin;
