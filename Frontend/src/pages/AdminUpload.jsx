import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../utils/apiBase.js";
import styles from "./AdminUpload.module.css";
import AiUnavailableModal from "../components/AiUnavailableModal.jsx";

export default function AdminUpload() {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    address: "",
    height: "",
    weight: "",
    crime: "",
    status: "ARRESTED",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAiModal, setShowAiModal] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    const token = localStorage.getItem("token");

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        // AI model/server unavailable
        if (
          res.status === 500 ||
          res.status === 502 ||
          res.status === 503
        ) {
          setShowAiModal(true);
        } else {
          alert(data.message || data.error || "Upload failed.");
        }
        return;
      }

      alert("✅ Criminal Added Successfully");

      setForm({
        name: "",
        age: "",
        sex: "",
        address: "",
        height: "",
        weight: "",
        crime: "",
        status: "ARRESTED",
      });

      setFile(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);

      setShowAiModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.leftPanel}>
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className={styles.previewImgLarge}
              />
            ) : (
              <div className={styles.previewPlaceholder}>
                📸 Upload Image to Preview
              </div>
            )}
          </div>

          <div className={styles.rightPanel}>
            <h2 className={styles.title}>🚨 Add Criminal</h2>

            <div className={styles.grid}>
              <input
                className={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <input
                className={styles.input}
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />

              <select
                className={styles.select}
                value={form.sex}
                onChange={(e) => handleChange("sex", e.target.value)}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                className={styles.input}
                placeholder="Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />

              <input
                className={styles.input}
                type="number"
                placeholder="Height (cm)"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />

              <input
                className={styles.input}
                type="number"
                placeholder="Weight (kg)"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />

              <input
                className={styles.input}
                placeholder="Crime"
                value={form.crime}
                onChange={(e) => handleChange("crime", e.target.value)}
              />
            </div>

            <div className={styles.status}>
              <button
                type="button"
                className={
                  form.status === "ARRESTED"
                    ? styles.activeBtn
                    : styles.btn
                }
                onClick={() => handleChange("status", "ARRESTED")}
              >
                Arrested
              </button>

              <button
                type="button"
                className={
                  form.status === "NOT ARRESTED"
                    ? styles.activeBtn
                    : styles.btn
                }
                onClick={() =>
                  handleChange("status", "NOT ARRESTED")
                }
              >
                Not Arrested
              </button>
            </div>

            <input
              ref={fileInputRef}
              className={styles.fileInput}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];

                if (!f) return;

                if (preview) {
                  URL.revokeObjectURL(preview);
                }

                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
            />

            <button
              className={styles.submit}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Adding Criminal..." : "➕ Add Criminal"}
            </button>
          </div>
        </div>
      </div>

      <AiUnavailableModal
        open={showAiModal}
        feature="Criminal Enrollment"
        onClose={() => setShowAiModal(false)}
      />
    </>
  );
}
