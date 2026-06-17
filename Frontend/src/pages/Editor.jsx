import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetPanel from "../components/AssetPanel.jsx";
import CanvasArea from "../components/CanvasArea.jsx";
import LayersPanel from "../components/LayersPanel.jsx";
import Toast from "../components/Toast.jsx";
import { useCanvas } from "../hooks/useCanvas.js";
import { useToast } from "../hooks/useToast.js";
import { API_BASE_URL } from "../utils/apiBase.js";
import styles from "./Editor.module.css";
import AiUnavailableModal from "../components/AiUnavailableModal.jsx";

export default function Editor() {
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  
  const token = localStorage.getItem("token");

  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [gender, setGender] = useState(() => {
    // Force an explicit choice at least once per session
    return sessionStorage.getItem("generatedGender") ?? "";
  });
  
  const [showAiModal, setShowAiModal] = useState(false);

  const {
    canvasRef,
    elements,
    selectedElement,
    selectedId,
    addElement,
    deleteSelected,
    bringForward,
    sendBackward,
    setRotation,
    setPositionX,
    setPositionY,
    selectById,
    downloadImage,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    CANVAS_W,
    CANVAS_H,
  } = useCanvas(showToast);

  // Welcome toast on mount
  useEffect(() => {
    showToast("Welcome to FORENSIGHT! 🎨", "info");
  }, []); // eslint-disable-line

  

  const uploadImageForMatch = async () => {
  if (!token) {
    showToast("Please login first", "warning");
    return;
  }

  // Hosted demo:
  // DeepFace inference is intentionally disabled.
  setShowAiModal(true);
}; 

  const generatePreview = () => {
    if (!canvasRef.current) return;
    if (elements.length === 0) {
      showToast("Add some elements first!", "warning");
      return;
    }
    if (!gender) {
      showToast("Please select a gender.", "warning");
      return;
    }
    const url = canvasRef.current.toDataURL("image/png");
    setGeneratedImageUrl(url);
    setSearchAttempted(false);
    setMatches([]);

    try {
      sessionStorage.setItem("generatedImageUrl", url);
      sessionStorage.setItem("generatedGender", gender);
    } catch {
      // ignore storage failures
    }

    navigate("/results", { state: { generatedImageUrl: url, gender } });
  };

  const onGenderChange = (nextGender) => {
    setGender(nextGender);
    try {
      sessionStorage.setItem("generatedGender", nextGender);
    } catch {
      // ignore storage failures
    }
  };

  const uploadGeneratedForMatch = () => {
  if (!generatedImageUrl) {
    showToast("Generate the image first", "warning");
    return;
  }

  uploadImageForMatch();
};

  const goToUploadForm = () => {
    navigate("/upload");
  };

  return (
    <div className={styles.appWrapper}>
      <div className={styles.layout}>
        <AssetPanel onSelect={addElement} />

        <CanvasArea
          canvasRef={canvasRef}
          selectedElement={selectedElement}
          gender={gender}
          onGenderChange={onGenderChange}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onDelete={deleteSelected}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onDownload={downloadImage}
          onGenerate={generatePreview}
          onSearch={uploadGeneratedForMatch}
          onUploadToDatabase={goToUploadForm}
          generatedImageUrl={generatedImageUrl}
          matches={[]}
          searchLoading={false}
          searchAttempted={false}
          onRotate={setRotation}
          onMoveX={setPositionX}
          onMoveY={setPositionY}
          canvasW={CANVAS_W}
          canvasH={CANVAS_H}
        />

        <LayersPanel
          elements={elements}
          selectedId={selectedId}
          onSelect={selectById}
        />
      </div>

      <AiUnavailableModal
        open={showAiModal}
        feature="Face Recognition"
        onClose={() => setShowAiModal(false)}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
