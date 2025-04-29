"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: process.env['MAIL_USER'],
        pass: process.env['MAIL_PASS'],
    },
});
// Send form message to admin + confirmation to user
const sendMail = (name, email, text) => __awaiter(void 0, void 0, void 0, function* () {
    // Send to admin
    yield transporter.sendMail({
        from: `"Contact Form" <${process.env['MAIL_USER']}>`,
        to: process.env['MAIL_RECEIVER'],
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`
    });
    // Confirmation to user
    yield transporter.sendMail({
        from: `"Bright Group Ltd." <${process.env['MAIL_USER']}>`,
        to: email,
        subject: "We've received your message",
        text: `Hi ${name},\n\nThank you for contacting Me. I've received your message and will get back to you shortly.\n\nBest Regards,\nTounga Saidou`
    });
});
exports.sendMail = sendMail;
// Send follow-up "no reply received" message
//ToDO: Automate FollowUP Email
// export const sendNoReply = async (email: string) => {
//   await transporter.sendMail({
//     from: `"Bright Group Ltd." <${process.env['MAIL_USER']}>`,
//     to: email,
//     subject: "Just checking in",
//     text: `Hi there,\n\nWe noticed you haven’t replied. If you still need help or have questions, feel free to reach out anytime.\n\nWarm regards,\nTounga Saidou`
//   });
// };
