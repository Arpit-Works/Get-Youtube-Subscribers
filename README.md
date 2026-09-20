# Get-Youtube-Subscribers

This project is a simple Node.js application for managing subscribers. It includes functionality to  retrieve a list of subscribers, retrieve a list of subscriber names, and retrieve details of a specific subscriber by ID.

## Prerequisites
Before running the application, ensure that you have the following installed:

- Node.js
- MongoDB (for local database setup)
## Getting Started
1. Clone the repository to your local machine:

```bash
git clone https://github.com/Arpit-Works/Get-Youtube-Subscribers.git
```
2. Install dependencies:

```bash
npm install
```
3. Create the database (Make sure MongoDB is installed on your local machine):

```bash
node src/createDatabase.js
```
4. Start the server:

```bash
node src/index.js
```
 The server will be running at http://localhost:3000.

## Endpoints
### Get all subscribers
- Endpoint: GET http://localhost:3000/subscribers
- Response: An array of subscribers (an Object).
### Get subscriber names
- Endpoint: GET http://localhost:3000/subscribers/names
- Response: An array of subscribers (an Object with only two fields: name and subscribedChannel).
### Get subscriber by ID
- Endpoint: GET http://localhost:3000/subscribers/:id
- Response:
If the ID is valid, returns a subscriber (an object) with the given ID.
If the ID is invalid, returns a status code 400 and an error message: {message: error.message}.
