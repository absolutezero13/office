import express from "express";
import {
  deleteImage,
  deleteUser,
  getAllUsers,
  getUser,
  getUserImages,
  isUnique,
  signIn,
  signInWithToken,
  signUp,
  updateUser,
  uploadImages,
} from "../controllers/userController";
import multer from "multer";
import { checkJwt } from "../helpers/auth";
import { generateUsers } from "../controllers/devController";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signin-with-token", checkJwt, signInWithToken);
router.route("/").get(checkJwt, getAllUsers);
router.route("/isUnique").post(isUnique);
router.route("/generate-users").get(generateUsers);

router
  .route("/:id")
  .get(checkJwt, getUser)
  .delete(checkJwt, deleteUser)
  .patch(checkJwt, updateUser);

// IMAGE ROUTES
router
  .route("/:id/images")
  .get(checkJwt, getUserImages)
  .post(upload.array("image"), uploadImages);

router.route("/:id/images/:imageName").delete(deleteImage);

export default router;
