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
exports.statUpload = exports.addEnergy = exports.deleteUser = exports.updateUser = exports.userInfo = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("./../models/user.model"));
const mongoose_1 = require("mongoose");
const production_1 = require("../data/production");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().select("-password");
    res.status(200).send(users);
});
exports.getAllUsers = getAllUsers;
const userInfo = (req, res) => {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    user_model_1.default.findById(req.params.id, (err, docs) => {
        !err ? res.status(200).send(docs) : res.status(400).send({ message: err });
    }).select("-password");
};
exports.userInfo = userInfo;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        yield user_model_1.default.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                pseudo: req.body.pseudo,
                email: req.body.email
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        })
            .then((docs) => {
            res.send(docs);
        })
            .catch((err) => res.status(400).send({ message: err }));
    }
    catch (err) {
        return res.status(400).send({ message: err });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        yield user_model_1.default.deleteOne({ _id: req.params.id }).exec();
        res.status(200).send({ message: "Successfully deleted. " });
    }
    catch (err) {
        return res.status(400).send({ message: err });
    }
});
exports.deleteUser = deleteUser;
const addEnergy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (yield user_model_1.default.find()).forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
        let theDate = new Date().getHours();
        try {
            if (element.energy >= 11) {
                console.log("Max");
            }
            else {
                production_1.production.forEach(pro => {
                    if (theDate == pro.hours) {
                        if (pro.pick >= 0.50) {
                            element.updateOne({ $inc: { energy: +1 } }).exec();
                        }
                        else if (pro.pick >= 0.80) {
                            element.updateOne({ $inc: { energy: +2 } }).exec();
                        }
                    }
                });
            }
        }
        catch (err) {
            return console.log(err);
        }
    }));
});
exports.addEnergy = addEnergy;
const statUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { energy, ecology, money, wellBeing, health } = req.body;
        yield user_model_1.default.findByIdAndUpdate({ _id: req.params.id }, { $set: {
                energy, ecology, money, wellBeing, health
            } }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        })
            .then((docs) => res.status(200).send(docs))
            .catch((err) => res.status(400).send({ message: err }));
    }
    catch (err) {
        return res.status(400).send({ message: err });
    }
});
exports.statUpload = statUpload;
setInterval(exports.addEnergy, 1000 * 60 * 3);
//# sourceMappingURL=user.controller.js.map