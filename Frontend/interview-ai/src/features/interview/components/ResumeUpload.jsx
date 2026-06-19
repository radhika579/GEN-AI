import React from 'react'

const ResumeUpload = ({ file, onFileChange, onRemoveFile }) => {
    const handleDragOver = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('drag-over')
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('drag-over')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('drag-over')
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
            onFileChange(droppedFile)
        }
    }

    return (
        <div className="resume-upload-section">
            <div className="upload-header">
                <h4>Upload Resume</h4>
                <span className="badge badge-best">Best Results</span>
            </div>
            <label
                htmlFor="resume"
                className="upload-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {file ? (
                    <div className="file-selected">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{file.name}</span>
                        <button
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                                e.preventDefault()
                                onRemoveFile()
                            }}
                            aria-label="Remove file"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="upload-text">Click to upload or <strong>drag & drop</strong></p>
                        <p className="upload-hint">PDF or DOCX (Max 5MB)</p>
                    </>
                )}
            </label>
            <input
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.docx"
                onChange={(e) => onFileChange(e.target.files[0])}
            />
        </div>
    )
}

export default ResumeUpload
