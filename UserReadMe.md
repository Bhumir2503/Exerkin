## 🔄 User Sync Overview

The **User Sync** system ensures that each user's profile data is consistent across multiple devices. It combines **Firebase Firestore** for real-time cloud updates and **Realm** for offline-first local caching.

---

### 📦 Data Flow Architecture

Firestore (User Doc) --> [onSnapshot] --> React State --> Realm ^ fallback on failure | <-----------------------------

---

### ✅ What’s Synced

| Field           | Source    | Description                           |
| --------------- | --------- | ------------------------------------- |
| `userId`        | Firestore | Unique user identifier (doc ID)       |
| `username`      | Firestore | Chosen username                       |
| `email`         | Firestore | User's email address                  |
| `bio`           | Firestore | Optional biography                    |
| `gender`        | Firestore | "male", "female", etc.                |
| `unitSystem`    | Firestore | "imperial" or "metric"                |
| `createdAt`     | Firestore | Account creation timestamp            |
| `updatedAt`     | Firestore | Last profile update timestamp         |
| `setupComplete` | Firestore | Whether the user completed onboarding |

---

### ⚙️ Sync Strategy

#### 🔁 Firestore → Realm (Real-Time)

-   Uses Firestore’s `onSnapshot` to listen for changes to `/users/{uid}`
-   Updates local React state and caches in Realm

#### 📴 Realm Fallback (Offline Mode)

-   If Firestore is unavailable, Realm is used as a fallback source
-   Enables offline support for user data

#### 🔐 Firestore Writes (Controlled)

-   User profile updates are **only allowed while online**
-   Prevents conflicts and ensures data consistency

---

### 🔍 Listener Lifecycle

-   Listener starts when the user logs in
-   Automatically unsubscribed on logout or unmount
-   Enables live updates across devices logged into the same account

---

### 💾 Realm Integration

-   Every Firestore update is written to Realm using `setRealmUser()`
-   Realm is used to serve cached data and support offline usage

---

### ✨ Benefits

-   ✅ Real-time sync across devices
-   ✅ Offline support with Realm fallback
-   ✅ Simplified sync logic by restricting writes to online only
-   ✅ Smooth onboarding flow with `setupComplete` flag

---

### 🛠️ Future Considerations

-   Add `lastSyncedAt` or `version` fields for smarter merge handling
-   Introduce partial sync if profile data becomes large
-   Add sync/network status indicators in the UI
