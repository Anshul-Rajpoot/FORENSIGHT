import { createPortal } from "react-dom";
import styles from "./AiUnavailableModal.module.css";

export default function AiUnavailableModal({ open, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>🤖</div>

        <h2 className={styles.title}>
          AI Features Unavailable in Hosted Demo
        </h2>

        <p className={styles.description}>
          FORENSIGHT uses <strong>DeepFace (FaceNet)</strong> for facial
          recognition and criminal matching.
        </p>

        <div className={styles.infoBox}>
          <h3>Why is this feature unavailable?</h3>

          <p>
            The deployed version is hosted on <strong>Render Free Tier</strong>,
            which provides only <strong>512 MB RAM</strong>. DeepFace requires
            significantly more memory to load AI models, so image-based
            recognition cannot be performed in the hosted demo.
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.column}>
            <h4>Available in Demo</h4>

            <ul>
              <li>✅ Secure Authentication</li>
              <li>✅ Criminal Database</li>
              <li>✅ Face Composite Editor</li>
              <li>✅ Canvas Image Generation</li>
              <li>✅ MongoDB Integration</li>
              <li>✅ Responsive UI</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Available Locally</h4>

            <ul>
              <li>🧠 AI Criminal Enrollment</li>
              <li>🧠 Face Recognition</li>
              <li>🧠 DeepFace Embeddings</li>
              <li>🧠 Similarity Matching</li>
              <li>🧠 Generated Face Search</li>
            </ul>
          </div>
        </div>

        <div className={styles.note}>
          <strong>Note:</strong> This limitation is due to the hosting
          platform, not the application itself. Running the project locally
          enables the complete AI pipeline.
        </div>

        <div className={styles.buttons}>
          <a
            href="https://github.com/Anshul-Rajpoot/FORENSIGHT---Criminal-Face-Generation-and-Recognition-System"
            target="_blank"
            rel="noreferrer"
            className={styles.githubBtn}
          >
            View GitHub
          </a>

          <button onClick={onClose} className={styles.closeBtn}>
            Continue Demo
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
