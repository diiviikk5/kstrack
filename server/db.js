import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'db.json');

// Initialize Firebase Admin if configuration is available
let firestore = null;
let useFirebase = false;

// Check for service account file or ENV variables
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, 'firebase-service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firestore = admin.firestore();
    useFirebase = true;
    console.log('Successfully connected to Firebase Firestore Cloud DB.');
  } catch (error) {
    console.error('Failed to initialize Firebase with service account. Falling back to local DB.', error.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    firestore = admin.firestore();
    useFirebase = true;
    console.log('Successfully connected to Firebase Firestore Cloud DB via environment variables.');
  } catch (error) {
    console.error('Failed to initialize Firebase with ENV variables. Falling back to local DB.', error.message);
  }
} else {
  console.log('Firebase credentials not found. Using local JSON database (server/db.json) as fallback.');
}

// Local JSON File DB implementation
function readLocalDB() {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ signals: [] }, null, 2));
      return { signals: [] };
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(data || '{"signals":[]}');
  } catch (error) {
    console.error('Error reading local database file:', error.message);
    return { signals: [] };
  }
}

function writeLocalDB(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to local database file:', error.message);
  }
}

// Unified Database API
export const db = {
  // Get all signals
  async getSignals() {
    if (useFirebase && firestore) {
      const snapshot = await firestore.collection('signals').get();
      const signals = [];
      snapshot.forEach(doc => {
        signals.push({ id: doc.id, ...doc.data() });
      });
      return signals;
    } else {
      const local = readLocalDB();
      return local.signals;
    }
  },

  // Get a single signal by ID
  async getSignal(id) {
    if (useFirebase && firestore) {
      const doc = await firestore.collection('signals').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } else {
      const local = readLocalDB();
      const signal = local.signals.find(s => s.id === id);
      return signal || null;
    }
  },

  // Create or Update a signal
  async saveSignal(id, signalData) {
    if (useFirebase && firestore) {
      await firestore.collection('signals').doc(id).set(signalData, { merge: true });
      return { id, ...signalData };
    } else {
      const local = readLocalDB();
      const index = local.signals.findIndex(s => s.id === id);
      const updatedSignal = { id, ...signalData };
      
      if (index !== -1) {
        // Merge with existing
        local.signals[index] = { ...local.signals[index], ...signalData };
      } else {
        // Add new
        local.signals.push(updatedSignal);
      }
      
      writeLocalDB(local);
      return updatedSignal;
    }
  },

  // Delete a signal
  async deleteSignal(id) {
    if (useFirebase && firestore) {
      const doc = await firestore.collection('signals').doc(id).get();
      if (!doc.exists) return false;
      await firestore.collection('signals').doc(id).delete();
      return true;
    } else {
      const local = readLocalDB();
      const initialLength = local.signals.length;
      local.signals = local.signals.filter(s => s.id !== id);
      if (local.signals.length === initialLength) return false;
      writeLocalDB(local);
      return true;
    }
  }
};
