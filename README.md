# 🧠 ForenSight – Criminal Face Reconstruction and Recognition System

<p align="center">
  <strong>An AI-assisted forensic identification system for generating composite facial sketches and matching them against a criminal database.</strong>
</p>
<img width="1380" height="794" alt="image" src="https://github.com/user-attachments/assets/c748b74b-dcf4-4729-9cd1-9d0e79b45dee" />
---

## 📌 Overview

**ForenSight** is a full-stack forensic identification platform designed to assist in suspect identification.

The application allows users to construct a suspect's face by combining modular facial components such as face shape, eyes, nose, lips, hair, beard, moustache, and eyebrows through an interactive canvas-based editor.

Once the composite face is generated, it can be exported as an image and searched against a criminal database. The system uses **DeepFace** and **FaceNet** to generate facial embeddings and uses **cosine similarity** to find visually similar records.

The project combines:

- Interactive face reconstruction
- Full-stack web development
- Computer vision
- Facial embeddings
- Database management
- Authentication and authorization
- Cloud image storage

---

# 🚀 Features

## 🎨 Interactive Face Builder

- Create composite faces using modular facial components
- Canvas-based face editor
- Drag and reposition facial features
- Resize individual components
- Layer-based editing
- Add, remove, and reorder facial components
- Smart positioning of facial assets
- Generate and export the final composite as an image

### Supported Facial Components

- Face Shapes
- Hair
- Eyes
- Eyebrows
- Nose
- Lips
- Beard
- Moustache
- Left Ear
- Right Ear

Each facial component is added as an independent canvas layer, allowing the user to move, resize, replace, delete, and reorder individual features.

---

# 🔍 Face Recognition

ForenSight provides a facial recognition workflow for identifying similar records from the criminal database.

The system:

1. Takes the generated or uploaded face image
2. Sends the image to the Python face-recognition service
3. Extracts a facial embedding using **DeepFace**
4. Uses the **FaceNet** model for embedding generation
5. Compares the generated embedding with stored embeddings
6. Calculates similarity using **cosine similarity**
7. Ranks the matching criminal records
8. Displays the most similar results to the user

---

# 👤 Authentication & Authorization

The application provides authentication and role-based access control.

### User

Regular users can:

- Create composite faces
- Generate facial sketches
- Search the criminal database
- Upload/search images
- View matching results

### Admin

Administrators can:

- Upload criminal records
- Upload criminal images
- Generate and store facial embeddings
- Manage criminal database records
- Access administrative functionality

Passwords are securely hashed using **bcrypt** and authenticated sessions are maintained using Express sessions.

---

# 🖥️ Frontend

The original React frontend has been replaced with a simpler server-rendered architecture using technologies that are easier to understand and maintain for a college project.

### Frontend Technologies

- EJS
- HTML5
- CSS3
- Vanilla JavaScript
- HTML5 Canvas API

EJS is used for server-side rendering, while JavaScript handles client-side interactions such as:

- Canvas editing
- Dragging
- Resizing
- Layer management
- Asset selection
- API requests
- Image generation and download

---

# ⚙️ Backend

The main backend is built using **Node.js and Express.js**.

It handles:

- Application routing
- Authentication
- Session management
- User management
- Criminal record management
- Image uploads
- Cloudinary integration
- MongoDB operations
- Face recognition requests
- Communication with the Python face-recognition service

---

# 🧠 Face Recognition Service

Since **DeepFace is a Python-based computer vision library**, the face-recognition functionality is separated into a small Python service.

The Node.js backend communicates with this service through HTTP.

```text
Node.js + Express
        │
        │ HTTP Request
        ▼
Python Face Service
        │
        ▼
     DeepFace
        │
        ▼
      FaceNet
        │
        ▼
Facial Embedding
```

This keeps the main web application in the Node.js ecosystem while allowing the project to use DeepFace for facial recognition.

---

# 🗄️ Database & Storage

## MongoDB Atlas

MongoDB Atlas is used for storing:

- User accounts
- Criminal records
- Criminal metadata
- Facial embeddings
- Application data

The application uses **Mongoose** to interact with MongoDB.

## Cloudinary

Cloudinary is used for storing and serving uploaded criminal images.

This avoids storing large image files directly inside the MongoDB database.

---

# 🏗️ System Architecture

```text
                         User
                           │
                           ▼
                ┌─────────────────────┐
                │     EJS Frontend    │
                │  HTML + CSS + JS    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Node.js + Express │
                │      Backend        │
                └───────┬─────┬───────┘
                        │     │
             ┌──────────┘     └──────────┐
             ▼                           ▼
       MongoDB Atlas                 Cloudinary
             │
             │
             ▼
     Criminal Records
     + Facial Embeddings


                Node.js + Express
                       │
                       │ HTTP
                       ▼
              ┌─────────────────┐
              │ Python Service  │
              │    DeepFace     │
              └────────┬────────┘
                       │
                       ▼
                    FaceNet
                       │
                       ▼
              Facial Embedding
                       │
                       ▼
               Cosine Similarity
                       │
                       ▼
                Matching Results
```

---

# 🔄 Recognition Workflow

```text
Witness Description
        │
        ▼
Composite Face Generation
        │
        ▼
Canvas Export (PNG)
        │
        ▼
Node.js / Express Backend
        │
        ▼
Python Face Recognition Service
        │
        ▼
DeepFace + FaceNet
        │
        ▼
Facial Embedding
        │
        ▼
Cosine Similarity
        │
        ▼
Criminal Database
        │
        ▼
Ranked Matching Results
```

---

# 🛠️ Tech Stack

## Frontend

- EJS
- HTML5
- CSS3
- JavaScript
- HTML5 Canvas API

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## AI / Computer Vision

- Python
- DeepFace
- FaceNet
- TensorFlow
- NumPy
- OpenCV
- Pillow

## Image Storage

- Cloudinary
- Multer

## Authentication

- Express Session
- bcryptjs

---

# 📂 Project Structure

```text
ForenSight/
│
├── app.js
├── package.json
├── .env
│
├── models/
│   ├── User.js
│   └── Criminal.js
│
├── routes/
│   ├── auth.js
│   ├── criminal.js
│   └── face.js
│
├── controllers/
│   ├── authController.js
│   ├── criminalController.js
│   └── faceController.js
│
├── services/
│   ├── cloudinary.js
│   └── faceService.js
│
├── views/
│   ├── partials/
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── editor.ejs
│   ├── results.ejs
│   ├── members.ejs
│   └── admin-upload.ejs
│
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── python_service/
│   ├── face_service.py
│   └── requirements.txt
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Anshul-Rajpoot/FORENSIGHT---Criminal-Face-Generation-and-Recognition-System.git

cd FORENSIGHT-Node-EJS
```

---

# 2. Install Node.js Dependencies

Make sure Node.js is installed.

```bash
npm install
```

---

# 3. Create Python Virtual Environment

Python **3.11** is recommended for the DeepFace/TensorFlow environment.

### Windows

```powershell
py -3.11 -m venv .venv
```

Activate the environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Linux / macOS

```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

---

# 4. Install Python Dependencies

With the virtual environment activated:

```bash
python -m pip install --upgrade pip setuptools wheel
```

Then:

```bash
python -m pip install -r python_service/requirements.txt
```

---

# 5. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_CONNECTION_STRING=your_mongodb_connection_string
MONGO_DB_NAME=your_database_name

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MATCH_THRESHOLD=0.30

PYTHON_CMD=python
```

Do not commit the `.env` file to GitHub.

---

# 6. Start the Application

Make sure the Python virtual environment is activated.

Then run:

```bash
npm start
```

The application will start at:

```text
http://localhost:3000
```

The Node.js backend automatically starts the Python face-recognition service when required.

---

# 🧪 Testing the Face Recognition Service

You can verify that the Python environment is working using:

```bash
python -c "import numpy; print('NumPy:', numpy.__version__)"
```

Then:

```bash
python -c "from deepface import DeepFace; print('DeepFace OK')"
```

If both commands work, the face-recognition dependencies are installed correctly.

---

# 🔐 Environment Variables

The application uses the following environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the Express server |
| `MONGO_CONNECTION_STRING` | MongoDB Atlas connection string |
| `MONGO_DB_NAME` | MongoDB database name |
| `SESSION_SECRET` | Secret used for Express sessions |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `MATCH_THRESHOLD` | Similarity threshold for face matching |
| `PYTHON_CMD` | Python executable used by the application |

---

# 🎯 Use Cases

ForenSight can be used for:

- Criminal investigation assistance
- Digital forensic sketch generation
- Suspect visualization
- Criminal database search
- Educational demonstrations
- Computer vision research
- Facial recognition system demonstrations

---

# ⚠️ Current Limitations

- Composite quality depends on the available facial assets.
- Recognition performance depends heavily on the quality and realism of the generated composite.
- Face recognition models are primarily designed for photographs, so generated composite sketches may produce lower-quality matches.
- Similarity search currently compares embeddings sequentially, making it more suitable for small to medium-sized datasets.
- The system is intended as an **assistance tool**, not as a standalone method for identifying a suspect.
- DeepFace/TensorFlow requires a compatible Python environment and can require significant computational resources.

---

# 🚀 Future Improvements

Possible future improvements include:

- Faster vector search using FAISS
- Improved facial asset library
- Automatic face alignment
- Better composite realism
- Improved face preprocessing
- Confidence-based match filtering
- Vector database integration
- Enhanced administrative dashboard
- Pagination for large criminal databases
- GPU acceleration for faster embedding generation
- Better handling of composite/sketch-style faces

---

# 📊 Performance

The system's performance depends on the hardware, image quality, database size, and face-recognition model.

The main factors affecting performance are:

- Face detection time
- Embedding generation time
- Number of stored criminal records
- Database query time
- Image upload/download time
- Python service response time

For larger datasets, vector-search techniques such as **FAISS** can be introduced to avoid sequential comparison of every stored embedding.

---

# 🔒 Security Considerations

The application includes basic security mechanisms such as:

- Password hashing using bcrypt
- Session-based authentication
- Role-based authorization
- Environment variables for sensitive credentials
- Restricted administrative functionality
- Cloudinary-based image storage

Sensitive configuration values such as database credentials, Cloudinary keys, and session secrets should never be committed to the repository.

---

# 👨‍💻 Author

**Anshul Rajpoot**

B.Tech ECE  
Maulana Azad National Institute of Technology (MANIT), Bhopal

---

# ⭐ Project Highlights

ForenSight demonstrates the integration of several technologies into a single full-stack application:

```text
Frontend
   ↓
EJS + HTML + CSS + JavaScript
   ↓
Node.js + Express
   ↓
MongoDB + Cloudinary
   ↓
Python Face Service
   ↓
DeepFace + FaceNet
   ↓
Facial Embeddings
   ↓
Cosine Similarity
   ↓
Matching Criminal Records
```

The project focuses on building a practical understanding of **full-stack development, computer vision, facial embeddings, database management, and authentication** in a single application.
