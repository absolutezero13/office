import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserImages,
  signIn,
  signUp,
  updateUser,
  uploadImage,
} from "../controllers/userController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/upload-images", upload.array("image"), uploadImage);
router.route("/").get(getAllUsers);
router.route("/:id/images").get(getUserImages);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
