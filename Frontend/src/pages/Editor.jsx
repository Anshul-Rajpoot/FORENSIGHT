import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssetPanel from "../components/AssetPanel.jsx";
import CanvasArea from "../components/CanvasArea.jsx";
import LayersPanel from "../components/LayersPanel.jsx";
import Toast from "../components/Toast.jsx";
import AiUnavailableModal from "../components/AiUnavailableModal.jsx";

import { useCanvas } from "../hooks/useCanvas.js";
import { useToast } from "../hooks/useToast.js";

import styles from "./Editor.module.css";

export default function Editor() {
  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const [gender, setGender] = useState(() => {
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

  useEffect(() => {
    showToast("Welcome to FORENSIGHT! 🎨", "info");
  }, []);

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

    try {
      sessionStorage.setItem("generatedImageUrl", url);
      sessionStorage.setItem("generatedGender", gender);
    } catch {
      // ignore
    }

    navigate("/results", {
      state: {
        generatedImageUrl: url,
        gender,
      },
    });
  };

  const onGenderChange = (nextGender) => {
    setGender(nextGender);

    try {
      sessionStorage.setItem("generatedGender", nextGender);
    } catch {
      // ignore
    }
  };

  // Hosted demo only
  const uploadGeneratedForMatch = () => {
    setShowAiModal(true);
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
