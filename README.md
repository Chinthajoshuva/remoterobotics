# Remote Robotics Lab Website

A simple web application for remotely accessing and controlling robots in a laboratory setting. The website provides user authentication, robot scheduling, and remote robot control capabilities.

## Features

- User authentication system
- Robot scheduling interface
- Live robot video feed
- Remote robot control interface
- Responsive design for all devices

## Pages

1. **Login Page** (`index.html`)
   - User authentication
   - Redirects to scheduling page after successful login

2. **Scheduling Page** (`schedule.html`)
   - View available time slots
   - Book robot access sessions
   - Navigate between different days

3. **Robot Access Page** (`access.html`)
   - Live video feed from the robot
   - Control buttons for robot movement
   - Real-time command sending to robot

## Setup

1. Clone this repository
2. Open `index.html` in a web browser
3. Use any username and password to log in (demo mode)

## Technical Details

- Built with HTML5, CSS3, and vanilla JavaScript
- Uses CSS Grid and Flexbox for responsive layouts
- Implements localStorage for session management
- Prepared for integration with a backend API

## API Integration

The robot control system is prepared for integration with a backend API. To integrate with your robot control system:

1. Update the API endpoint in `script.js`
2. Modify the command format in the `sendCommand` function
3. Implement proper authentication in production

## Security Notes

- This is a demo implementation using localStorage for authentication
- In production, implement proper authentication and security measures
- Use HTTPS for secure communication
- Implement proper session management
- Add input validation and sanitization

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge 