import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import '../../style/interview.scss'
import { useInterview } from '../../hooks/useInterview.js'

const Interview = () => {
    const { interviewId } = useParams()
    const { loading, report, getReportById } = useInterview()
    const [activeSection, setActiveSection] = useState('technical')

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading) {
        return (
            <div className="interview-loading-container">
                <div className="loading-content">
                    <div className="spinner-large"></div>
                    <h2>Analyzing Interview Strategy...</h2>
                    <p>Fetching technical questions, behavioral focus, and skill gaps.</p>
                </div>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="interview-loading-container">
                <div className="loading-content">
                    <h2>No Report Found</h2>
                    <p>We couldn't retrieve this interview strategy report.</p>
                    <Link to="/" className="back-home-btn">Go Back Home</Link>
                </div>
            </div>
        )
    }

    const technicalQuestions = report.technicalQuestion || []
    const behavioralQuestions = report.behavioralQuestion || []
    const preparationPlan = report.preparationPlan || []
    const skillGaps = report.skillGaps || []
    const matchScore = report.matchScore || 0
    const title = report.title || "Interview Strategy Plan"

    const navItems = [
        { key: 'technical', label: 'Technical Questions', icon: '💻', count: technicalQuestions.length },
        { key: 'behavioral', label: 'Behavioral Questions', icon: '🧠', count: behavioralQuestions.length },
        { key: 'roadmap', label: 'Road Map', icon: '🗺️', count: preparationPlan.length }
    ]

    const getSeverityClass = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return 'severity-high'
            case 'medium': return 'severity-medium'
            case 'low': return 'severity-low'
            default: return 'severity-low'
        }
    }

    const renderMainContent = () => {
        switch (activeSection) {
            case 'technical':
                return (
                    <div className="content-section">
                        <div className="content-header">
                            <div>
                                <h2>💻 Technical Questions</h2>
                                <p className="section-subtitle">Key areas targeted to your technical stack and the job profile</p>
                            </div>
                            <span className="question-count">{technicalQuestions.length} questions</span>
                        </div>
                        {technicalQuestions.length === 0 ? (
                            <div className="no-data-card">No technical questions generated for this profile.</div>
                        ) : (
                            <div className="questions-list">
                                {technicalQuestions.map((item, idx) => (
                                    <QuestionCard key={idx} index={idx + 1} data={item} type="technical" />
                                ))}
                            </div>
                        )}
                    </div>
                )
            case 'behavioral':
                return (
                    <div className="content-section">
                        <div className="content-header">
                            <div>
                                <h2>🧠 Behavioral Questions</h2>
                                <p className="section-subtitle">STAR-method questions to showcase soft skills and culture fit</p>
                            </div>
                            <span className="question-count">{behavioralQuestions.length} questions</span>
                        </div>
                        {behavioralQuestions.length === 0 ? (
                            <div className="no-data-card">No behavioral questions generated for this profile.</div>
                        ) : (
                            <div className="questions-list">
                                {behavioralQuestions.map((item, idx) => (
                                    <QuestionCard key={idx} index={idx + 1} data={item} type="behavioral" />
                                ))}
                            </div>
                        )}
                    </div>
                )
            case 'roadmap':
                return (
                    <div className="content-section">
                        <div className="content-header">
                            <div>
                                <h2>🗺️ Preparation Roadmap</h2>
                                <p className="section-subtitle">Structured daily tasks to master key concepts and address weaknesses</p>
                            </div>
                            <span className="question-count">{preparationPlan.length} days</span>
                        </div>
                        {preparationPlan.length === 0 ? (
                            <div className="no-data-card">No preparation plan generated for this profile.</div>
                        ) : (
                            <div className="roadmap-list">
                                {preparationPlan.map((day, idx) => (
                                    <RoadmapCard key={idx} data={day} />
                                ))}
                            </div>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <main className="interview-page">
            {/* Left Sidebar — Navigation */}
            <aside className="sidebar sidebar-left">
                <div className="sidebar-header-custom">
                    <Link to="/" className="back-link">← New Strategy</Link>
                    <div className="report-title-container">
                        <span className="title-label">Target Role</span>
                        <h4 className="report-role-title">{title}</h4>
                    </div>
                    <div className="match-score-badge">
                        <span className="score-value">{matchScore}%</span>
                        <span className="score-label">Match</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.key)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            <span className="nav-count">{item.count}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Center — Main Content */}
            <section className="main-content">
                {renderMainContent()}
            </section>

            {/* Right Sidebar — Skill Gaps */}
            <aside className="sidebar sidebar-right">
                <div className="sidebar-section">
                    <h3 className="sidebar-title">
                        <span className="title-icon">⚡</span>
                        Skill Gaps
                    </h3>
                    {skillGaps.length === 0 ? (
                        <p className="no-gaps-text">No significant skill gaps identified! You are highly matched.</p>
                    ) : (
                        <div className="skill-tags">
                            {skillGaps.map((gap, idx) => (
                                <span
                                    key={idx}
                                    className={`skill-tag ${getSeverityClass(gap.Severity)}`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </main>
    )
}

/* ---------- Sub-components ---------- */

const QuestionCard = ({ index, data, type }) => {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={`question-card ${type}`}>
            <div className="question-top" onClick={() => setExpanded(!expanded)}>
                <span className="question-index">Q{index}</span>
                <p className="question-text">{data.question}</p>
                <button className="expand-btn" aria-label="Toggle answer">
                    {expanded ? '▲' : '▼'}
                </button>
            </div>

            {expanded && (
                <div className="question-details">
                    <div className="detail-block intention">
                        <span className="detail-label">🎯 Intention</span>
                        <p>{data.intention}</p>
                    </div>
                    <div className="detail-block answer">
                        <span className="detail-label">✅ Suggested Answer</span>
                        <p>{data.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadmapCard = ({ data }) => {
    const tasks = Array.isArray(data.tasks) ? data.tasks : []
    return (
        <div className="roadmap-card">
            <div className="day-badge">
                <span className="day-number">Day {data.day}</span>
            </div>
            <div className="roadmap-body">
                <h4 className="roadmap-focus">{data.focus}</h4>
                <ul className="roadmap-tasks">
                    {tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Interview
