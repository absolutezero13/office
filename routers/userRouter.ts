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
  .route("/:id/images")
  .get(getUserImages)
  .delete(deleteImage)
  .post(upload.array("image"), uploadImages);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
