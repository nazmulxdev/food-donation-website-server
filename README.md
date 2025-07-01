# Meals4Gaza - Food Sharing Website (Server)

This repository contains the backend server for the "Meals4Gaza" Food Sharing platform. This server manages all data related to donated, shared, and requested food items in a MongoDB database.

<div align="center">

[![Live Server URL](https://img.shields.io/badge/Live_API-Online-blueviolet?style=for-the-badge)](https://new-meals4gaza.vercel.app/)
[![Client Repo](https://img.shields.io/badge/Client_Repo-GitHub-333?style=for-the-badge&logo=github)](https://github.com/nazmulxdev/food-donation-website-client)

</div>

---

### **Server Overview**

This is the server-side of the Meals4Gaza website. It is responsible for managing all backend logic, including handling API requests, interacting with the MongoDB database, and ensuring secure data operations. The entire backend is built on the CRUD (Create, Read, Update, Delete) methodology.

---

### **Key Features**

✅ **CRUD Based:** The entire API is based on the CRUD method for efficient data management.

✅ **Secure Environment:** Database keys and other sensitive credentials are secured in environment variables.

✅ **Firebase Middleware:** Implements Firebase middleware to validate user requests and ensure that only authenticated and authorized users can perform certain actions.

✅ **Secure Firebase Config:** The Firebase JSON configuration is converted to Base64 and stored securely in environment variables to protect service account credentials.

✅ **Built with Express.js:** Uses the Express.js framework for cleaner, more maintainable, and scalable code compared to raw Node.js.

✅ **Organized Collections:** Manages data across multiple collections within the MongoDB database.

✅ **RESTful API:** Provides a set of REST API endpoints based on the database collections.

✅ **NoSQL Database:** Leverages MongoDB, allowing for flexible, schema-less data structures.

---

### **Technologies Used**

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Firebase_Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase Admin" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

### **Dependencies Used**

The following NPM packages are used in this server:
* Express.js
* Cors
* Dotenv
* MongoDB
* Firebase Admin

---

### **Getting Started Locally**

Follow these steps to run the server on your local machine:

**1. Clone the repository:**
```bash
git clone [https://github.com/your-username/your-server-repo-name.git](https://github.com/your-username/your-server-repo-name.git)
```

**2. Navigate to the project directory:**
```bash
cd your-server-repo-name
```

**3. Install NPM packages:**
```bash
npm install
```

**4. Set up environment variables:**
Create a file named `.env` in the root directory and add your MongoDB and Firebase credentials.
```.env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_firebase_config
```
*(Replace the values above with your own credentials.)*

**5. Run the server:**
To start the server in development mode, run:
```bash
npm run dev
```
The server will start, typically on a local port like `http://localhost:5000`.

---

### **Relevant Links**

* **Live Client Site:** [https://karamplate.web.app/](https://karamplate.web.app/)
* **Client-Side Repository:** [https://github.com/nazmulxdev/food-donation-website-client](https://github.com/nazmulxdev/food-donation-website-client)
