import React, { useEffect, useRef, useState } from 'react';
import { X, Download, ExternalLink, FileText, Maximize2, Minimize2 } from 'lucide-react';

const PdfModal = ({ isOpen, pdf, onClose, isRu = true }) => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus container so Esc is captured immediately
    if (containerRef.current) {
      containerRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pdf) return null;

  return (
    <div
      className="pdf-modal-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={pdf.title || 'PDF Viewer'}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="pdf-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pdf-modal-header">
          <div className="pdf-modal-title-wrap">
            <span className="pdf-modal-icon-badge">
              <FileText size={18} />
            </span>
            <div className="pdf-modal-meta">
              <h3 className="pdf-modal-title" title={pdf.title}>
                {pdf.title}
              </h3>
              <div className="pdf-modal-subtitle">
                <span className="pdf-modal-filename">{pdf.filename}</span>
                {pdf.size && <span className="pdf-modal-dot">•</span>}
                {pdf.size && <span>{pdf.size}</span>}
                {pdf.pages && <span className="pdf-modal-dot">•</span>}
                {pdf.pages && <span>{pdf.pages}</span>}
              </div>
            </div>
          </div>

          <div className="pdf-modal-actions">
            <button
              type="button"
              className="pdf-modal-action-btn"
              onClick={toggleNativeFullscreen}
              title={
                isFullscreen
                  ? isRu
                    ? 'Обычный экран'
                    : 'Exit fullscreen'
                  : isRu
                  ? 'Во весь экран'
                  : 'Full screen'
              }
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span className="pdf-modal-btn-label">
                {isFullscreen
                  ? isRu
                    ? 'Обычный экран'
                    : 'Exit fullscreen'
                  : isRu
                  ? 'Во весь экран'
                  : 'Full screen'}
              </span>
            </button>

            <a
              href={pdf.url}
              download={pdf.filename}
              className="pdf-modal-action-btn"
              title={isRu ? 'Скачать файл' : 'Download file'}
            >
              <Download size={15} />
              <span className="pdf-modal-btn-label">
                {isRu ? 'Скачать' : 'Download'}
              </span>
            </a>

            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-modal-action-btn"
              title={isRu ? 'В отдельной вкладке' : 'Open in new tab'}
            >
              <ExternalLink size={15} />
              <span className="pdf-modal-btn-label">
                {isRu ? 'Новая вкладка' : 'New tab'}
              </span>
            </a>

            <button
              type="button"
              className="pdf-modal-close-btn"
              onClick={handleClose}
              aria-label={isRu ? 'Закрыть (Esc)' : 'Close (Esc)'}
              title={isRu ? 'Закрыть (Esc)' : 'Close (Esc)'}
            >
              <X size={17} />
              <kbd className="pdf-modal-esc-hint">Esc</kbd>
            </button>
          </div>
        </div>

        <div className="pdf-modal-body">
          <iframe
            src={`${pdf.url}#toolbar=1&navpanes=0`}
            title={pdf.title}
            className="pdf-modal-frame"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfModal;

