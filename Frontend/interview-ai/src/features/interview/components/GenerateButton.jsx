import React from 'react'

const GenerateButton = ({ onClick, disabled, loading }) => {
    return (
        <div className="generate-footer">
            <div className="footer-info">
                <span className="sparkle">✦</span>
                <span>AI-Powered Strategy Generation • Approx 30s</span>
            </div>
            <button
                type="button"
                className="button primary-button generate-btn"
                onClick={onClick}
                disabled={disabled || loading}
            >
                {loading ? (
                    <span className="btn-loading">
                        <span className="spinner"></span>
                        Generating...
                    </span>
                ) : (
                    <>
                        <span className="btn-sparkle">✦</span>
                        Generate My Interview Strategy
                    </>
                )}
            </button>
        </div>
    )
}

export default GenerateButton
