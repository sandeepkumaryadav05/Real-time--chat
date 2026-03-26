const router = require("express").Router();
const { register, login, getUsers,searchUsers,uploadAvatar} = require("../controllers/auth.controller");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.get("/search", auth, searchUsers);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);


module.exports = router;
