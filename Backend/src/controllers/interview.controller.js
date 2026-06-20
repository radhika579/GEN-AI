const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../Services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user selfdescription,resume pdf and job description
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const transformedSkillGaps = (interViewReportByAi.skillGaps || []).map(gap => ({
        skill: gap.skill,
        Severity: gap.severity
    }))

    const transformedPreparationPlan = (interViewReportByAi.preparationplan || []).map(p => ({
        day: p.day,
        focus: Array.isArray(p.focus) ? p.focus.join(', ') : p.focus,
        tasks: Array.isArray(p.tasks) ? p.tasks : (p.tasks ? [p.tasks] : [])
    }))

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDesciption: jobDescription,
        matchScore: interViewReportByAi.matchScore ?? null,
        technicalQuestion: interViewReportByAi.technicalQuestions || [],
        behavioralQuestion: interViewReportByAi.behavioralQuestions || [],
        skillGaps: transformedSkillGaps,
        preparationPlan: transformedPreparationPlan,
        title: interViewReportByAi.title || ""
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterViewReportController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterViewReportsController(req, res) {

    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDesciption -__v -technicalQuestion -behavioralQuestion -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
}

module.exports = { generateInterViewReportController, getInterViewReportController, getAllInterViewReportsController }