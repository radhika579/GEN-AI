import React from 'react'
import ResumeUpload from './ResumeUpload'
import SelfDescriptionInput from './SelfDescriptionInput'

const ProfileSection = ({
    resumeFile,
    onFileChange,
    onRemoveFile,
    selfDescription,
    onSelfDescriptionChange
}) => {
    const hasResume = !!resumeFile
    const hasSelfDescription = selfDescription?.trim().length > 0

    return (
        <div className="profile-card">
            <div className="card-header">
                <div className="card-title">
                    <span className="card-icon profile-icon">👤</span>
                    <h3>Your Profile</h3>
                </div>
            </div>

            <ResumeUpload
                file={resumeFile}
                onFileChange={onFileChange}
                onRemoveFile={onRemoveFile}
            />

            <div className="divider">
                <span>OR</span>
            </div>

            <SelfDescriptionInput
                value={selfDescription}
                onChange={onSelfDescriptionChange}
            />

            <div className={`info-banner ${hasResume || hasSelfDescription ? 'satisfied' : ''}`}>
                <span className="info-dot"></span>
                <p>
                    Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                </p>
            </div>
        </div>
    )
}

export default ProfileSection
