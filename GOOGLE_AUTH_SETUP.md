# How to Get Your Google Client ID

To fix the `Error 401: invalid_client`, you need to generate a **Google Client ID** and paste it into your code. An email address is not enough.

## Step 1: Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown (top left) and select **New Project**.
3. Name it "Travel App" and click **Create**.

## Step 2: Configure Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in:
   - **App Name**: Travel App
   - **User Support Email**: Select your email
   - **Developer Contact Email**: Enter your email again
4. Click **Save and Continue** until you finish (no need to add scopes for now).

## Step 3: Create Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
3. Application type: **Web application**.
4. Name: "React Client".
5. Under **Authorized JavaScript origins**, click **ADD URI** and enter:
   `http://localhost:5173`
   *(Make sure this matches the port in your browser exactly)*
6. Click **Create**.

## Step 4: Copy & Paste
1. A popup will show your **Client ID** (it looks like `123456789-abcdefg.apps.googleusercontent.com`).
2. Copy this string.
3. Open `c:\TravellingApp\index.jsx`.
4. Replace `"YOUR_GOOGLE_CLIENT_ID_HERE"` with your copied ID.
