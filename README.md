# Guido

A React Native mobile app that helps new people in a city find local tour guides to show them around.

## Project Structure

```
Guido/
├── assets/
│   ├── logo/          # Place your app logo files here
│   └── ...            # Other assets (icons, images)
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Screen components
│   ├── navigation/    # Navigation configuration
│   ├── services/      # API services and business logic
│   └── utils/         # Utility functions and helpers
├── App.js             # Main app component
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Development

The app is organized into packages for clean and maintainable code:
- **components/**: Reusable UI components
- **screens/**: Full screen components
- **navigation/**: Navigation setup
- **services/**: API calls and business logic
- **utils/**: Helper functions

## Logo

Place your logo files in the `assets/logo/` folder. Supported formats include PNG, SVG, and other image formats.

## License

Private project

