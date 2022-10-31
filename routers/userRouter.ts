import express from "express";
import {
  deleteImage,
  deleteUser,
  getAllUsers,
  getUser,
  getUserImages,
  signIn,
  signUp,
  updateUser,
  uploadImages,
} from "../controllers/userController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.route("/").get(getAllUsers);

router
  .route("/:id/images")
  .get(getUserImages)
  .delete(deleteImage)
  .post(upload.array("image"), uploadImages);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
