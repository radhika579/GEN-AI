import React from 'react'

const JobDescriptionInput = ({ value, onChange, maxLength = 5000 }) => {
    const charCount = value?.length || 0

    return (
        <div className="job-description-card">
            <div className="card-header">
                <div className="card-title">
                    <span className="card-icon job-icon">📋</span>
                    <h3>Target Job Description</h3>
                </div>
                <span className="badge badge-required">Required</span>
            </div>
            <div className="textarea-wrapper">
                <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    placeholder={`Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                    rows={14}
                />
                <div className="char-count">
                    <span className={charCount > 0 ? 'active' : ''}>{charCount}</span> / {maxLength} chars
                </div>
            </div>
        </div>
    )
}

export default JobDescriptionInput
