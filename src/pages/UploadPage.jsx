import { useRef, useState } from "react";
import PageContainer from "../components/PageContainer";
import { usePortfolio } from "../context/PortfolioContext";

export default function UploadPage() {
  const inputRef = useRef(null);
  const { handleCSVUpload, loading } = usePortfolio();

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "csv") {
      alert("Alleen CSV-bestanden worden ondersteund");
      return;
    }

    handleCSVUpload(file); // 🔥 DIT IS HET ENIGE BELANGRIJKE
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <PageContainer>
      <div className="upload-page">
        <h2>Upload transacties</h2>
        <p className="subtitle">
          Upload je CSV-bestand van je broker.
        </p>

        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="upload-icon">📄</div>

          <p className="upload-text">
            {fileName ? (
              <>✔ <strong>{fileName}</strong> geladen</>
            ) : (
              <>
                Sleep je bestand hierheen<br />
                <span>of klik om te uploaden</span>
              </>
            )}
          </p>

          <button className="primary-btn upload-btn">
            Bestand kiezen
          </button>

          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {loading && <p>⏳ Portfolio wordt verwerkt…</p>}
      </div>
    </PageContainer>
  );
}
