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
    .route("/:id")
    .get(auth_1.checkJwt, userController_1.getUser)
    .delete(auth_1.checkJwt, userController_1.deleteUser)
    .patch(auth_1.checkJwt, userController_1.updateUser);
// IMAGE ROUTES
router
    .route("/:id/images")
    .get(auth_1.checkJwt, userController_1.getUserImages)
    .delete(auth_1.checkJwt, userController_1.deleteImage)
    .post(auth_1.checkJwt, upload.array("image"), userController_1.uploadImages);
exports.default = router;
