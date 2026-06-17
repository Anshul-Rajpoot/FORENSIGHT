import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Results.module.css";
import AiUnavailableModal from "../components/AiUnavailableModal.jsx";

export default function Results() {
  const location = useLocation();

  const [generatedImageUrl, setGeneratedImageUrl] = useState(() => {
    return (
      location.state?.generatedImageUrl ||
      sessionStorage.getItem("generatedImageUrl") ||
      null
    );
  });

  const [gender, setGender] = useState(() => {
    return (
      location.state?.gender ||
      sessionStorage.getItem("generatedGender") ||
      "Any"
    );
  });

  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    if (location.state?.generatedImageUrl) {
      sessionStorage.setItem(
        "generatedImageUrl",
        location.state.generatedImageUrl
      );
      setGeneratedImageUrl(location.state.generatedImageUrl);
    }

    if (location.state?.gender) {
      sessionStorage.setItem("generatedGender", location.state.gender);
      setGender(location.state.gender);
    }
  }, [location.state]);

  const runSearch = (e) => {
    e?.preventDefault?.();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!generatedImageUrl) {
      alert("Please generate an image first");
      return;
    }

    // Hosted demo
    setShowAiModal(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.left}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Generated Image</h2>

            {generatedImageUrl ? (
              <img
                className={styles.generatedImg}
                src={generatedImageUrl}
                alt="Generated"
              />
            ) : (
              <p className={styles.muted}>No generated image yet.</p>
            )}
          </div>
        </section>

        <section className={styles.right}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Matched Faces</h2>

            <div className={styles.searchForm}>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={runSearch}
              >
                Search
              </button>
            </div>

            <div className={styles.resultsScroll}>
              <p className={styles.muted}>
                Click <strong>Search</strong> to try AI-powered face matching.
              </p>
            </div>
          </div>
        </section>
      </div>

      <AiUnavailableModal
        open={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
}
