"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../helpers/auth");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.post("/signup", userController_1.signUp);
router.post("/signin", userController_1.signIn);
router.route("/").get(auth_1.checkJwt, userController_1.getAllUsers);
router.route("/isUnique").post(userController_1.isUnique);
router
    .route("/:id/images")
    .get(userController_1.getUserImages)
    .delete(userController_1.deleteImage)
    .post(upload.array("image"), userController_1.uploadImages);
router.route("/:id").get(userController_1.getUser).delete(userController_1.deleteUser).patch(userController_1.updateUser);
exports.default = router;
