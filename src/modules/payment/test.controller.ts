import { OpenAI } from 'openai';
import catchAsync from "../../utils/catchAsync";

// Initialize OpenAI instance
const openai = new OpenAI({
    apiKey: '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', // Make sure to load dotenv in your main app file
});

const openAi = catchAsync(async (req, res) => {
    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or "gpt-4" if you have access
            messages: [{ role: "user", content: message }],
        });

        res.status(200).json({
            success: true,
            reply: response.choices[0].message.content,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error || "Something went wrong with OpenAI request.",
        });
    }
});

export const TestController = {
    openAi,
};
