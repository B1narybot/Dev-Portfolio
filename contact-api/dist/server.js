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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mailer_1 = require("./mailer");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 5000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// 1. Health check endpoint
app.get('/api/health', (_req, res) => {
    try {
        res.status(200).json({ status: 'FormMailer is healthy' });
    }
    catch (err) {
        console.error('Health check failed:', err);
        res.status(400).json({ status: 'FormMailer health check failed' });
    }
});
// 2. Endpoint to handle form submission
app.post('/api/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, text } = req.body;
    if (!name || !email || !text) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        yield (0, mailer_1.sendMail)(name, email, text);
        res.status(200).json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Error sending contact email:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
}));
app.listen(PORT, () => {
    console.log(`✅ FormMailer server running on port ${PORT}`);
});
