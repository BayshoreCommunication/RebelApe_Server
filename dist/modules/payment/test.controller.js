"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const openai_1 = require("openai");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// Initialize OpenAI instance
const openai = new openai_1.OpenAI({
    apiKey: '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', // Make sure to load dotenv in your main app file
});
const openAi = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or "gpt-4" if you have access
            messages: [{ role: "user", content: message }],
        });
        res.status(200).json({
            success: true,
            reply: response.choices[0].message.content,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error || "Something went wrong with OpenAI request.",
        });
    }
}));
exports.TestController = {
    openAi,
};
