import React from 'react'

const SelfDescriptionInput = ({ value, onChange }) => {
    return (
        <div className="self-description-section">
            <h4>Quick Self-Description</h4>
            <textarea
                id="selfDescription"
                name="selfDescription"
                value={value}
                onChange={onChange}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                rows={4}
            />
        </div>
    )
}

export default SelfDescriptionInput
