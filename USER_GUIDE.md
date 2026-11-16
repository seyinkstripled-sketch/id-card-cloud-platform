# ID Studio Cloud: User & Operator Guide
### Federal Teaching Hospital, Ido-Ekiti — Identity Card Management Platform

---

## 1. Accessing the System

1. Open your web browser and navigate to:
   - **Local Development:** `http://localhost:3000`
   - **Production URL:** `https://<your-custom-domain>`
2. Click **Sign In** in the top navigation bar or navigate directly to `/login`.

### Pre-Configured Test Accounts:
- **System Administrator:**
  - Email: `admin@idstudio.gov.ng`
  - Password: `Admin123!@#`
  - Capabilities: Full system access, staff CRUD, user registration, security audit log access.
- **Card Issuance Officer:**
  - Email: `operator@idstudio.gov.ng`
  - Password: `Operator123!@#`
  - Capabilities: Issue new cards, capture passport photos, draw signatures, preview and print cards.

---

## 2. Issuing a New Staff ID Card (`/staff/new`)

1. From the navigation sidebar, click **Issue New Card**.
2. **Staff Details:**
   - **Staff ID Code:** Enter the employee number (e.g., `P6019`).
   - **Full Name:** Enter in standard hospital format (e.g., `AJAYI EMMANUEL I.`).
   - **Designation:** Enter official appointment (e.g., `Senior Nursing Officer`).
   - **Department:** Select directorate from the dropdown.
   - **Card Expiry Date:** Defaults to 2 years from today.
3. **Taking Passport Photo with Camera:**
   - Click **Capture with Camera**.
   - Ensure the employee's face is centered within the dashed oval guidelines.
   - Click **Take Passport Photo**.
   - The system automatically whitens and cleans the background.
   - Adjust the sensitivity slider if necessary, or toggle **Auto-White Background Removal**.
   - Click **Use This Photo**.
4. **Drawing Digital Signature:**
   - Click **Draw Signature**.
   - Using a mouse or touch screen, sign directly on the dark green signature pad above the guide line.
   - Select ink color (**White** is recommended for optimal contrast on the green card footer).
   - Click **Adopt Signature**.
5. **Real-Time Preview:**
   - Check the live card stage on the right-hand side. Both front and back sides update in real-time as you type.
6. Click **Issue Official ID Card** to save to the database.

---

## 3. Interactive Card Studio (`/studio`)

The Card Studio allows fine-tuning element layouts and printing cards:
1. Select an existing staff record from the **Select Staff Profile** dropdown.
2. Toggle between **Front Side** and **Back Side** using the top toolbar.
3. **Moveable Elements Mode:**
   - Check **Enable Tuning**.
   - Click on any component on the card (Passport Photo, Name Banner, Details, QR Code Box, or Footer).
   - Use the directional arrow buttons (←, →, ↑, ↓) to adjust its position.
   - Click **Reset** at any time to restore the official master positions.
4. Click **Print Card** to generate an ISO/IEC 7810 format printout.

---

## 4. Public QR Code Verification (`/verify/[code]`)

1. Open the camera app on any smartphone or tablet.
2. Scan the QR code located on the front of the staff card.
3. The browser will open the official verification page (`/verify/[code]`).
4. If authentic:
   - A green **Official Credential Verified** badge is displayed.
   - Staff photo, full name, staff ID, designation, and department are shown.
   - Verification timestamp and digital SHA-256 signature confirm the card's legitimacy.
5. If invalid or revoked:
   - An alert warning informs the verifier that the card is not registered.

---

## 5. Security Audit Trail (`/audit-logs`)

Administrators can inspect all activities recorded by the platform:
- User login sessions with timestamps and IP addresses.
- Card creation events with details of the issued staff member.
- Modifications, status changes, and deletions.
- Scans performed on the public verification portal.
- Filter events using the **All Actions** dropdown menu.
