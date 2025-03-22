*Suggested Changes:*
# Critical Project Configuration Guidelines

## 1. Dependency Management
- Perform a comprehensive codebase and dependency scan
- Lock dependency versions to ensure long-term compatibility
- Implement strict version control to prevent unintended updates
- Document the locked state as the baseline for future development

## 2. Build and Script Automation
- Enhance preinstall scripts with PowerShell compatibility
- Create an interactive Windows batch menu system that:
  - Presents common development tasks
  - Provides easy-to-use task selection interface
  - Automates routine development operations

## 3. Expo Compliance
- Ensure all implementations strictly follow Expo documentation (docs.expo.dev)
- Validate all features against current Expo best practices
- Maintain compatibility with Expo ecosystem requirements

## 4. Project Configuration Hardening
- Implement strict project-config.json settings:
  - Lock root directory configuration
  - Fix Expo version to 52.0.36 (no downgrades permitted)
  - Utilize lockfiles for consistent package resolution
  - Implement version verification checks for all future runs

## Best Practices
- Always reference official Expo documentation for implementations
- Maintain strict version control through lockfiles
- Implement automated verification systems
- Ensure cross-platform compatibility in all scripts
- Document all configuration decisions and constraints

## Implementation Notes
- Use package manager lockfiles to enforce dependency versions
- Implement automated checks for version compliance
- Create comprehensive documentation for configuration standards
- Establish clear upgrade procedures when changes are necessary
------------------------------

*Prompt:* fix warnings and errors minutely, systematically and using structured approach

*Prompt:*Enhanced the project health checks and monitoring system implementing the  following:
1. Automated Health Checks:
2. Runs every hour in watch mode
3. Checks version constraints
4. Validates
5. Validates the automated checks?
Note: Do not implement two-factor authentication and encryption for now.

*Prompt:* Read and analyze minutely all documents in context:- project-strucutre.md,project-instructions.md, tech-stack.md and requirements.md as well as expo documentaion at https://docs.expo.dev/  -, of the project for strict compliance of those as well as confirmation of  current status of every rule/point keeping consideration Windows Development Environment. If found warnings, errors and conflicts then resolve those in systematic way and structured approach. Make sure you have  created a well-defined, locked development environment where both the structure and technologies are standardized. Make schedule of scanning and compliance checking every hour for smooth running of project. Use *pnpm* as package manager. Also use *powershell* for over *rifraf*. Where possible and deeemed appropriate alwayse Use and execute multiple scripts files in different cmds at the same time to resolve issues in order  to get pararllel outputs and responses by AI Agent for the quickist and fastest resolutions to increase the speed and efficiency of the project. Make sure to auto close all open cmds after execution of each cmd without user intervention.  Also ensure complete and full health and compliance of all documents and instructions.

*Prompt:* creates a well-defined, locked development environment where both the structure and technologies are standardized.




Prompt: creates a well-defined, locked development environment where both the structure and technologies are standardized.


**Steps to Resolve Issues**
*1. Ensure You Have a Lockfile:*
Since you are using pnpm, you need to generate a lockfile. If you have already removed the node_modules and lock files, you can regenerate them by running:
   pnpm install
This command will install all dependencies listed in your package.json and create a pnpm-lock.yaml file.
*2. Check for Outdated Dependencies:*
After running pnpm install, you can check for outdated dependencies by running:
   pnpm outdated
This will show you any packages that are outdated and need to be updated.
*3. Update Dependencies:*
If you find any outdated dependencies, you can update them using:
   pnpm update
This will update all packages to their latest versions according to the version ranges specified in your package.json.
*4. Run Expo Doctor:*
After updating, run the following command to check for any issues with your Expo setup:
   npx expo-doctor
This will help identify any remaining issues with your project.
*5. Clear Cache and Start the Project:*
Clear the cache and start your project again:
   pnpm clean:cache
   pnpm start
   






-----------
npm run clean
npm run setup
npm start
----------------------------------
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled uuid
npm install --save-dev @types/uuid

# Run the development server
npm run dev

# Run tests
npm test

# Run specific test file
npm test Notes.test.tsx
---------------------------
If you're still seeing issues, we can try an alternative approach:
Create a new project with the latest Expo version:

    npx create-expo-app@latest modernnotes-new

Copy your source code to the new project:
    src/ folder
    app/ folder
    assets/ folder
Your configuration files (tsconfig.json, babel.config.js, etc.)
Update the dependencies in the new project's package.json to match your required packages:

----------------------------------------
{
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@react-native-voice/voice": "^3.2.4",
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-splash-screen": "~0.26.4",
    "expo-status-bar": "~1.11.1",
    "expo-system-ui": "~2.9.3",
    "expo-web-browser": "~12.8.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.73.4",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-web": "~0.19.6"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  }
}
----------------------

    npm run clean:windows
    npm start -- --clear

#To test these changes:
#1. Clean install:
    npm run clean:windows
#   npm install -- already included in above command
#2. Rebuild:
    expo prebuild --clean
#3. Start with clean cache:
    npm start -- --clear
#
-------------------------

npm run clean:windows
npm start -- --clear
npm run android

---------------------
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json
# or for Windows
rd /s /q node_modules
del package-lock.json

# Clear TypeScript cache
rm -rf .tsbuildinfo
# or for Windows
del .tsbuildinfo
-------------------------------------------------------------
# 1. Clean everything
rd /s /q node_modules
rd /s /q .expo
del package-lock.json
npm cache clean --force

# 2. Install dependencies
npm install

# 3. Start the development server
npm start -- --clear

---------------------------------
# Reinstall dependencies
npm install

# Start with clean cache
npm start -- --clear

npm add expo 

Notally is a minimalistic note taking app with a beautiful material design and powerful features


npm run clean:windows


rm -rf node_modules
rm -rf .expo
npm cache clean --force


npx create-expo-app@latest . --template

npm run reset-project


