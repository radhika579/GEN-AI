import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JobDescriptionInput from '../../components/JobDescriptionInput'
import ProfileSection from '../../components/ProfileSection'
import GenerateButton from '../../components/GenerateButton'
import '../../style/home.scss'
import { useInterview } from '../../hooks/useInterview.js'

const Home = () => {
    const navigate = useNavigate()
    const { loading, generateReport } = useInterview()
    const [jobDescription, setJobDescription] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [selfDescription, setSelfDescription] = useState('')

    const hasJobDescription = jobDescription.trim().length > 0
    const hasProfile = !!resumeFile || selfDescription.trim().length > 0
    const canGenerate = hasJobDescription && hasProfile

    const handleGenerate = async () => {
        try {
            const report = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (report && report._id) {
                navigate(`/interview/${report._id}`)
            }
        } catch (error) {
            console.error('Failed to generate report:', error)
        }
    }

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Create Your Custom <span className="gradient-text">Interview Plan</span>
                </h1>
                <p className="hero-subtitle">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </section>

            {/* Main Form Area */}
            <section className="form-container">
                <div className="form-grid">
                    <JobDescriptionInput
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <ProfileSection
                        resumeFile={resumeFile}
                        onFileChange={setResumeFile}
                        onRemoveFile={() => setResumeFile(null)}
                        selfDescription={selfDescription}
                        onSelfDescriptionChange={(e) => setSelfDescription(e.target.value)}
                    />
                </div>

                <GenerateButton
                    onClick={handleGenerate}
                    disabled={!canGenerate || loading}
                    loading={loading}
                />
            </section>
        </main>
    )
}

export default Home