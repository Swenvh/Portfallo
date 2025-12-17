import { useRef, useState } from "react";
import PageContainer from "../components/PageContainer";
import { usePortfolio } from "../context/PortfolioContext";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

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

    handleCSVUpload(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <PageContainer>
      <div className="upload-page-v2">
        <div className="upload-header-v2">
          <h2>Upload transacties</h2>
          <p className="subtitle">
            Importeer je CSV-bestand van je broker en analyseer je portfolio direct.
          </p>
        </div>

        <div className="upload-container">
          <div
            className={`upload-dropzone-v2 ${isDragging ? "dragging" : ""} ${fileName ? "has-file" : ""}`}
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className="upload-visual">
              {fileName ? (
                <div className="success-icon">
                  <CheckCircle2 size={48} />
                </div>
              ) : (
                <div className="upload-icon-v2">
                  <Upload size={48} />
                </div>
              )}
            </div>

            <div className="upload-content">
              {fileName ? (
                <>
                  <h3 className="upload-title success">Bestand geladen!</h3>
                  <p className="upload-filename">
                    <FileText size={18} />
                    {fileName}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="upload-title">Sleep je bestand hier</h3>
                  <p className="upload-description">
                    of klik om een CSV-bestand te selecteren
                  </p>
                </>
              )}
            </div>

            <button className="btn-upload">
              <Upload size={20} />
              {fileName ? "Ander bestand kiezen" : "Bestand selecteren"}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {loading && (
            <div className="upload-loading">
              <Loader2 size={24} className="spinner" />
              <span>Portfolio wordt verwerkt...</span>
            </div>
          )}

          <div className="upload-info">
            <h4>Ondersteunde formaten</h4>
            <ul>
              <li>
                <FileText size={18} />
                <div>
                  <strong>CSV bestanden</strong>
                  <p>Transactie exports van je broker</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
