// import express from "express";
// import Review from "../models/Review.js";

// const router = express.Router();

// // Add Review
// router.post("/", async (req, res) => {
//   try {
//     const { user, text, rating } = req.body;
//     const newReview = new Review({ user, text, rating });
//     await newReview.save();
//     res.status(201).json(newReview);
//   } catch (error) {
//     res.status(500).json({ error: "Error adding review" });
//   }
// });

// // Get Reviews
// router.get("/", async (req, res) => {
//   try {
//     const reviews = await Review.find().sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching reviews" });
//   }
// });

// export default router;
