const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../Services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req,res) {
    

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription} = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
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
        preparationPlan: transformedPreparationPlan
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}


module.exports = { generateInterViewReportController }