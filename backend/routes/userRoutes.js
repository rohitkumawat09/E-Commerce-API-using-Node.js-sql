import express from "express";
import { registerUser, loginUser ,logoutUser} from '../controllers/userController.js';
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Registration failed
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user and receive JWT token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Login failed
 */
router.post('/login', loginUser);


router.post("/logout", logoutUser);

router.get("/checkToken",authMiddleware ,(req,res)=>{
    res.json({user:req.user});
} );


export default router;
