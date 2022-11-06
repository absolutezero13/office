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
exports.deleteUser = exports.getUser = exports.updateUser = exports.getAllUsers = exports.signIn = exports.isUnique = exports.getUserImages = exports.deleteImage = exports.uploadImages = exports.signUp = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files) {
            res.status(400).json({
                message: "files required!",
            });
            return;
        }
        console.log("req.files!", req.files);
        const userId = req.params.id;
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
exports.uploadImages = uploadImages;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageName = req.params.imageName;
    const deleteCommand = new client_s3_1.DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
    });
    if (!imageName) {
        res.status(400).json({
            status: "fail",
            message: "No Image name provided",
        });
        return;
    }
    try {
        yield s3_1.s3.send(deleteCommand);
        yield userModel_1.default.updateOne({
            _id: req.params.id,
        }, {
            $pull: {
                pictures: {
                    image: imageName,
                },
            },
        });
        res.send({
            success: true,
            data: {
                message: "Image Deleted " + imageName,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.deleteImage = deleteImage;
const getUserImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
});
exports.getUserImages = getUserImages;
const isUnique = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fieldName, value } = req.body;
    try {
        const fieldData = yield userModel_1.default.findOne({ [fieldName]: value });
        if (!fieldData) {
            res.status(200).json({
                status: "success",
                isUnique: true,
            });
        }
        else {
            res.status(200).json({
                status: "success",
                isUnique: false,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: "No Image name provided",
        });
    }
});
exports.isUnique = isUnique;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        res.status(400).json({
            message: "fail",
            error,
        });
    }
});
exports.signIn = signIn;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const resp = await checkJwt(req, res);
        // console.log("resp?", resp);
        // if (!resp) return;
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
