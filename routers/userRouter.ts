import express from "express";
import {
  deleteImage,
  deleteUser,
  getAllUsers,
  getUser,
  getUserImages,
  isUnique,
  signIn,
  signUp,
  updateUser,
  uploadImages,
} from "../controllers/userController";
import multer from "multer";
import { checkJwt } from "../helpers/auth";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.route("/").get(checkJwt, getAllUsers);
router.route("/isUnique").post(isUnique);

router
  .route("/:id")
  .get(checkJwt, getUser)
  .delete(checkJwt, deleteUser)
  .patch(checkJwt, updateUser);

// IMAGE ROUTES
router
  .route("/:id/images")
  .get(checkJwt, getUserImages)
  .delete(checkJwt, deleteImage)
  .post(checkJwt, upload.array("image"), uploadImages);

export default router;
