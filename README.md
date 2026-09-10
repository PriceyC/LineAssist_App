LineAssist
-Mobile support application designed for supporting on site engineers in food manufacturing
-allows engineers to:
   -view line and site details
   -report new incidents
   -complete troubleshooting
   -submit evidence
   -track the status of incidents whilst awaiting remote support

-Features include:
   -user auth
   -site and production line selection
   -line status monitoring
   -incident:
      creation
      severity selection eg: priority
      history
      notes
      evidence capture
   Diagnostic troubleshooting and workflows
   local storage and offline functionality
   automatic syncing between offline and online db
   Network status polling

-Tech Stack:
   Frontend
      React Native
      Lucide
      Expo:
         Router
         SQLITE
         Image Picker
      Native Wind for styling

   Backend
      Node.js
      Express
      PostgreSQL
      Supabase and Vercel for hosting

-DB
   Main central DB is the posgreSQL hosted on Supabase whilst having the offline SQLite DB for storage and syncronisation. Stores only necessary info to maintain the app whilst offline and syncs all data up to the online db once network connectivity is restored

   Structure:
      Users
      Sites
      Production lines
      Devices
      Incidents
      Incident notes
      Incident evidence
      Incident status history
      Diagnostic sessions
      Diagnostic answers
      Incident statuses
      Incident severities

In order to run the app:
   Start by opening up the frontend
      cd LineAssist_App

   Then install dependancies
      npm install
   
   Then run the frontend application
      npx expo start

   I would recommend using a phone with expo go to test the app to fully utilise the functionality, but will work on an emulator

   One thing I would mention is when testing off my home network eg: an office network, expo sturggled to run and connect with my mobile, so a work around would be to hotspot your laptop to your phone, then run npm expo start --lan to be able to connect locally with your mobile.

   I have left the OLD API connection for locally testing the backend, however I would recommend leaving as is and testing against the hosted/deployed backend and DB. 

   Full requirements list, as well as requirements.txt ahve been generated:

   Frontend:
       @expo/ngrok@4.1.3
      ├── @expo/vector-icons@15.1.1
      ├── @react-navigation/bottom-tabs@7.18.16
      ├── @react-navigation/elements@2.9.38
      ├── @react-navigation/native@7.3.16
      ├── @types/react@19.2.18
      ├── babel-preset-expo@57.0.10
      ├── bcrypt@6.0.0
      ├── bcryptjs@3.0.3
      ├── eslint-config-expo@57.0.2
      ├── eslint@9.39.5
      ├── expo-constants@57.0.17
      ├── expo-file-system@57.0.6
      ├── expo-font@57.0.3
      ├── expo-haptics@57.0.2
      ├── expo-image-picker@57.0.16
      ├── expo-image@57.0.4
      ├── expo-linking@57.0.9
      ├── expo-network@57.0.1
      ├── expo-router@57.0.19
      ├── expo-splash-screen@57.0.8
      ├── expo-sqlite@57.0.2
      ├── expo-status-bar@57.0.1
      ├── expo-symbols@57.0.2
      ├── expo-system-ui@57.0.3
      ├── expo-web-browser@57.0.2
      ├── expo@57.0.20
      ├── lucide-react-native@1.41.0
      ├── nativewind@4.2.6
      ├── react-dom@19.2.3
      ├── react-native-gesture-handler@2.32.0
      ├── react-native-reanimated@4.5.1
      ├── react-native-safe-area-context@5.7.0
      ├── react-native-screens@4.26.2
      ├── react-native-web@0.21.2
      ├── react-native-worklets@0.10.1
      ├── react-native@0.86.3
      ├── react@19.2.3
      ├── tailwindcss@3.4.17
      └── typescript@6.0.3

   Backend:
      ├── @supabase/supabase-js@2.115.0
      ├── bcrypt@6.0.0
      ├── cors@2.8.6
      ├── dotenv@17.4.2
      ├── express@5.2.1
      ├── jsonwebtoken@9.0.3
      ├── multer@2.3.0
      ├── nodemon@3.1.14
      └── pg@8.23.0