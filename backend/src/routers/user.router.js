import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import {
    deleteUser,
    getCurrentUser,
    loginUser,
    logoutUser,
    passwordChange,
    registerUser,
    updateUserProfile
} from '../controllers/user.controllers.js'


const router = Router()

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/me").get(verifyJWT, getCurrentUser)

router.route("/detail-update").post(verifyJWT, updateUserProfile)

router.route("/password-change").post(verifyJWT, passwordChange)

router.route("/delete-account").post(verifyJWT, deleteUser)


export default router