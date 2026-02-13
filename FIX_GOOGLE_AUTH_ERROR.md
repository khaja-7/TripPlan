# Fix "Storagerelay URI is not allowed" Error

The error `Storagerelay URI is not allowed for 'NATIVE_DESKTOP' client type` means the **Google Client ID** you provided was created for a **Desktop/Mobile App**, but you are building a **Website**.

Google blocks "Desktop" keys from working in browsers for security reasons.

## Solution

You must create a **new** Client ID specifically for **Web**.

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**.

### Step 2: Select "Web application" (CRITICAL STEP)
**DO NOT** select "Desktop" or "Android".
1. **Application type**: Select **Web application** (this is the most important part).
2. **Name**: "Travel App Web".

### Step 3: Configure URI
1. Under **Authorized JavaScript origins**, click **ADD URI**.
2. Enter: `http://localhost:5173`
   *(This is the URL your app runs on locally. If you use a different port, change it here).*
3. Under **Authorized redirect URIs**, click **ADD URI**.
4. Enter: `http://localhost:5173`
5. Click **Create**.

### Step 4: Update Code
1. Copy the **NEW** Client ID (it will look similar but is now valid for Web).
2. Send the new ID to me, or paste it directly into `c:\TravellingApp\index.jsx`.
