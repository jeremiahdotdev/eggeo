# Eggeo Instructions for Installation and Usage
Our Nuxt.js app is a geolocation-based Easter egg hunt game. Users can create unique Egg IDs, print QR codes for each egg, and then place the QR codes on real Easter eggs. The app automatically sets the current location for each egg based on the user's geolocation. Other users can then scan the QR codes to find the eggs and earn points. The app includes features for viewing rankings, resetting scores, and email/password authentication backed by Prisma. With pages for user management, map display, rankings, and scanning, our app provides a fun and interactive Easter egg hunt experience for users of all ages.

This README provides instructions for installation and usage.

## Installation

To get started with this app, follow these steps:

1. Clone this repository to your local machine:
```
git clone <repository-url>
```
2. Navigate to the project directory:
```
cd <project-directory>
```
3. Install dependencies using pnpm:
```
pnpm install
```
4. Start the development server:
```
pnpm --filter @eggeo/vue dev
```
5. Open your web browser and visit http://localhost:3000 to view the app.

## Usage

This app is a geolocation client designed for Easter egg hunts. Here's a general overview of how to use it:

### Creating Egg IDs

1. Navigate to the **User** section of the app.
2. Click on the **Create** page.
3. Generate unique Egg IDs which will be used to identify each Easter egg.

### Printing QR Codes

1. After creating an Egg ID, proceed to the **Print** page within the **User** section.
2. Print out QR codes corresponding to each Egg ID generated.
3. Adhere the printed QR codes to the respective Easter eggs.

### Setting Egg Locations

1. To set the current location for an Easter egg, go to the **Hide** page within the **User** section.
2. Adhere the QR code to the Easter egg.
3. The app will automatically geolocate the current user and set the location of the Easter egg based on their current location.

### Scanning Easter Eggs

1. Other users can use the **Find** page to scan the QR codes adhered to the Easter eggs they find during the hunt.
2. Scanning the QR code will display the location of the Easter egg on the map.
3. Users will receive points for each Easter egg they scan.

### Viewing Rankings

1. Navigate to the **Rankings** page to view the leaderboard.
2. Users can see their ranking based on the number of Easter eggs scanned.

### Resetting Scores

1. If needed, users can reset their scores by visiting the **Reset Score** page within the **User** section.

### Authentication

Authentication within the app is managed with email/password accounts stored in the app database through Prisma.

### Pages Overview:

- **User**: Manages user-related functionalities.
  - **Create**: Generate unique Egg IDs.
  - **Hide**: Automatically sets the current location for Easter eggs.
  - **Reset Score**: Reset user scores.
  - **Print**: Print QR codes for Easter eggs.
- **Map**: Displays the map with Easter egg locations.
- **Rankings**: Displays the leaderboard.
- **Find**: Allows users to scan Easter eggs to view their locations.

Feel free to explore and enjoy the Easter egg hunt experience!
