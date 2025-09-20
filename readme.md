Web Chat Application

A simple web chat application built using the MERN stack (MongoDB, Express, React, Node.js) with client and server modules.

Repository Structure

client/ — Frontend built with React.

server/ — Backend built with Node.js and Express.

README.md — Project documentation.

Features

Real-time chat — Powered by WebSockets for instant messaging.

CRUD operations — Create, read, update, and delete messages.

Authentication — User login and account management.

Contact list — Display available chat contacts.

Chat history — View previous messages.

Notifications — Alerts for new messages.

Optional features:

File uploads

Avatars

Emojis

Image viewer

WYSIWYG editor

Online status

Group chat / conference

Requirements

Node.js

npm or yarn

MongoDB

Installation

Clone the repository:

git clone https://github.com/eringz/web-chat.git
cd web-chat


Install server dependencies:

cd server
npm install


Install client dependencies:

cd ../client
npm install


Configure environment variables:

Create .env files in both server and client directories with variables like database URL, JWT secret, etc.

Start the server:

cd ../server
npm start


Start the client:

cd ../client
npm start

Usage

Open your browser and visit http://localhost:3000
 to start using the application.

License

This project is licensed under the MIT License.
