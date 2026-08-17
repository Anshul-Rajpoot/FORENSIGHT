# 🧠 ForenSight – Criminal Face Reconstruction and Recognition System

<p align="center">
  <strong>An AI-assisted forensic identification system for generating composite facial sketches and matching them against a criminal database.</strong>
</p>

---

## 📌 Overview

**ForenSight** is a full-stack forensic identification platform designed to assist law enforcement agencies in suspect identification. The application enables users to construct a suspect's face by assembling modular facial components such as face shape, eyes, nose, lips, hair, beard, and eyebrows through an interactive canvas-based editor.

Once the facial composite is generated, the system converts it into an image and compares it against a criminal database using **DeepFace facial embeddings** and **cosine similarity**, returning the most similar matches.

The project combines **interactive frontend engineering**, **computer vision**, **authentication**, and **database management** into a single application.

---

# 🚀 Features

## 🎨 Interactive Face Builder

* Create composite faces using modular facial components
* Interactive canvas-based editor
* Drag and reposition facial features
* Resize facial components
* Layer-based editing system
* Smart positioning for facial assets
* Export generated composite as an image

---

## 🔍 Face Recognition

* Upload generated composite for identification
* DeepFace-based facial embedding extraction
* FaceNet embedding generation
* Cosine similarity-based matching
* Ranked list of matching criminal records

---

## 👤 Authentication & Authorization

* Secure user authentication
* Token-based authorization
* Password hashing
* Role-based access control

### User

* Generate composite faces
* Search criminal database
* View matching results

### Admin

* Upload criminal records
* Upload criminal images
* Manage criminal database

---

## 🖥️ Frontend

* React + Vite
* Canvas API
* Modular component architecture
* Custom hooks
* Responsive UI
* Interactive drag-and-drop editing

---

## ⚙️ Backend

* Flask REST APIs
* Authentication middleware
* Criminal record management
* Image processing pipeline
* Face recognition workflow

---

## 🗄️ Database & Storage

* MongoDB Atlas
* Cloudinary image storage
* Criminal records
* User accounts
* Facial embeddings

---

# 🏗️ System Architecture

```text
               User
                 │
                 ▼
      React Frontend (Vite)
                 │
                 ▼
     Canvas Face Reconstruction
                 │
                 ▼
        Flask REST API
        ┌────────┴─────────┐
        ▼                  ▼
 DeepFace (FaceNet)     MongoDB
        │                  │
        ▼                  │
 Facial Embeddings         │
        │                  │
        └──────► Cosine Similarity ◄──────┘
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
DeepFace Embedding Extraction
          │
          ▼
Cosine Similarity Comparison
          │
          ▼
Criminal Database Search
          │
          ▼
Top Matching Suspects
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* CSS Modules
* HTML5 Canvas API

### Backend

* Python
* Flask

### Database

* MongoDB Atlas

### AI / Computer Vision

* DeepFace
* FaceNet
* NumPy

### Storage

* Cloudinary

### Authentication

* itsdangerous (Signed Token Authentication)
* Werkzeug Password Hashing

---

# 📂 Project Structure

```text
ForenSight/
│
├── Backend/
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# 🎭 Facial Components

The composite sketch is generated using categorized facial assets:

* Face Shapes
* Hair
* Eyes
* Eyebrows
* Nose
* Lips
* Beard
* Moustache
* Left Ear
* Right Ear

Each component is added as an independent canvas layer, allowing users to move, resize, replace, and reorder individual features.

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Anshul-Rajpoot/FORENSIGHT---Criminal-Face-Generation-and-Recognition-System.git
cd ForenSight
```

---

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

## Backend

```bash
cd Backend
pip install -r requirements.txt
python app.py
```

Runs on:

```text
http://localhost:5000
```

---

# 🔐 Environment Variables

Create a `.env` file inside the Backend directory.

```env
SECRET_KEY=your_secret_key

MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🎯 Use Cases

* Criminal investigation assistance
* Digital forensic sketch generation
* Suspect visualization
* Criminal database search
* Educational demonstrations
* Research in face recognition systems

---

# ⚠️ Current Limitations

* Composite quality depends on available facial assets.
* Recognition accuracy is influenced by sketch quality.
* Current similarity search performs comparisons against stored embeddings sequentially, making it suitable for small to medium-sized datasets.

---

# 🚀 Future Improvements

* Faster vector search using FAISS
* Improved facial asset library
* Automatic face alignment
* Better sketch realism
* Confidence threshold for match filtering
* Enhanced administrative dashboard

---

# 👨‍💻 Author

**Anshul Rajpoot**

