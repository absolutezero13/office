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
exports.deleteUser = exports.getUser = exports.updateUser = exports.getAllUsers = exports.signIn = exports.getUserImages = exports.uploadImage = exports.signUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../helpers/auth");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../aws/s3");
const crypto_1 = __importDefault(require("crypto"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 2 ways of creating document in mongoose
    // 1-
    // const user: Document = new User({
    //   username,
    //   email,
    //   password,
    //   secretQuestion,
    // });
    //await user.save();
    // 2-
    try {
        const newUserInfo = req.body;
        newUserInfo.password = yield bcryptjs_1.default.hash(newUserInfo.password, 10);
        const newUser = yield userModel_1.default.create(newUserInfo);
        res.status(201).json({
            status: "success",
            data: newUser,
        });
    }
    catch (err) {
        console.log("err", err);
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.signUp = signUp;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files) {
            res.status(400).send({
                message: "files required!",
            });
            return;
        }
        const { userId } = req.body;
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            const imageName = file.originalname + "-" + crypto_1.default.randomUUID();
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: imageName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const imageObj = new client_s3_1.PutObjectCommand(params);
            yield s3_1.s3.send(imageObj);
            yield userModel_1.default.updateOne({
                _id: userId,
            }, {
                $push: { pictures: { image: imageName, order: 0 } },
            });
        }
        res.send({
            success: true,
            data: {
                message: "Images Uploaded",
            },
        });
    }
    catch (error) {
        console.log(error);
        res.send({
            success: false,
            error,
        });
    }
});
exports.uploadImage = uploadImage;
const getUserImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    const images = [];
    if (user) {
        for (const imageObj of user === null || user === void 0 ? void 0 : user.pictures) {
            const getObjParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: imageObj.image,
            };
            const command = new client_s3_1.GetObjectCommand(getObjParams);
            const imageUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3_1.s3, command, {
                expiresIn: 36000,
            });
            images.push(imageUrl);
        }
        res.status(200).json({
            status: "success",
            images,
        });
    }
});
exports.getUserImages = getUserImages;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.body;
    const user = yield userModel_1.default.findOne({ username: userInfo.username });
    if (!user) {
        console.log("user not found");
        res.status(404).send({
            status: "fail",
            message: "User not found",
        });
        return;
    }
    const isMatch = yield bcryptjs_1.default.compare(userInfo.password, user.password);
    if (!isMatch) {
        console.log("user not found");
        res.status(400).json({
            status: "fail",
            message: "Wrong password",
        });
        return;
    }
    console.log("success!!");
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        username: user.username,
        email: user.email,
    }, "secret");
    user.password = null;
    res.status(200).json({
        data: {
            token,
            user,
        },
    });
});
exports.signIn = signIn;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield (0, auth_1.checkJwt)(req, res);
        console.log("resp?", resp);
        if (!resp)
            return;
        console.log("finding users");
        const users = yield userModel_1.default.find().select("-password");
        // const users = await User.find({})
        //   .where("username")
        //   .equals(req.query.username);
        res.status(200).json({
            data: users,
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, updatedUser, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            data: user,
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.updateUser = updateUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.id);
        res.status(200).json({
            data: user,
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndDelete(req.params.id);
        res.status(204).json({
            data: user,
        });
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.deleteUser = deleteUser;
