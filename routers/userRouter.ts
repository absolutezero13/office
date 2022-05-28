import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  signIn,
  signUp,
  updateUser,
} from "../controllers/userController";

const router = express.Router();
console.log("hey");

router.post("/signup", signUp);
router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

export default router;
