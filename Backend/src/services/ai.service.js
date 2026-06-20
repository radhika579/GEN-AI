const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const apiKey =
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    process.env.GOOGLE_GENAI_API_KEY

if (!apiKey) {
    throw new Error(
        "Missing Google GenAI API key. Set GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY in .env",
    )
}

const ai = new GoogleGenAI({ apiKey })

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).default([]).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).default([]).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for job and career"),
    })).default([]).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationplan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.array(z.string()).default([]).describe("The main focus of this day in the preparation plan, e.g data structures, system design,etc."),
        tasks: z.array(z.string()).default([]).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a book etc."),
    })).default([]).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the interview report is generated"),
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return only valid JSON that exactly matches the schema below. Do not include any extra explanation, markdown, or text.
`

    const responseSchema = z.toJSONSchema(interviewReportSchema)
    const maxRetries = 5
    let attempt = 0
    let lastErr
    const primaryModel = "gemini-2.5-flash-lite"
    const fallbackModel = "gemini-2.5-flash-lite"

    const callModel = async (model) => {
        return await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: responseSchema,
            },
        })
    }

    while (attempt < maxRetries) {
        try {
            const response = await callModel(primaryModel)
            const parsed = response && response.text ? JSON.parse(response.text) : response
            const validated = interviewReportSchema.parse(parsed)
            console.log(validated)
            return validated
        } catch (err) {
            lastErr = err
            const code = err?.status || err?.error?.code || err?.code
            if (code === 503 || (err && /high demand|temporar/i.test(err.message || ''))) {
                attempt++
                const delay = Math.min(1000 * 2 ** attempt, 20000)
                console.warn(
                    `GenAI request failed (attempt ${attempt}/${maxRetries}): ${err.message || err}. Retrying in ${delay}ms...`,
                )
                await new Promise((r) => setTimeout(r, delay))
                continue
            }
            throw err
        }
    }

    try {
        console.warn('Primary model exhausted retries; trying fallback model:', fallbackModel)
        const response = await callModel(fallbackModel)
        const parsed = response && response.text ? JSON.parse(response.text) : response
        const validated = interviewReportSchema.parse(parsed)
        console.log(validated)
        return validated
    } catch (err) {
        console.error('Fallback model request failed:', err)
        throw lastErr || err
    }

}

module.exports = generateInterviewReport
