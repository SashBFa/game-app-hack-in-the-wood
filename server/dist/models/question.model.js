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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const questionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 255,
        unique: true,
        trim: true,
    },
    answerA: {
        type: String,
        required: true,
    },
    answerB: {
        type: String,
        required: true,
    },
    ecologyA: {
        type: Number,
        required: true,
    },
    moneyA: {
        type: Number,
        required: true,
    },
    wellBeingA: {
        type: Number,
        required: true,
    },
    healthA: {
        type: Number,
        required: true,
    },
    ecologyB: {
        type: Number,
        required: true,
    },
    moneyB: {
        type: Number,
        required: true,
    },
    wellBeingB: {
        type: Number,
        required: true,
    },
    healthB: {
        type: Number,
        required: true,
    },
    didUKnow: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 255,
        unique: true,
        trim: true,
    },
});
const QuestionModel = mongoose_1.default.model("question", questionSchema);
exports.default = QuestionModel;
//# sourceMappingURL=question.model.js.map