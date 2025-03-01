// // const mongoose = require('mongoose');

// // const BookingSchema = new mongoose.Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   event: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Event',
// //     required: true
// //   },
// //   quantity: {
// //     type: Number,
// //     default: 1
// //   },
// //   totalPrice: {
// //     type: Number,
// //     required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['Confirmed', 'Pending', 'Cancelled'],
// //     default: 'Pending'
// //   }
// // }, { 
// //   timestamps: true 
// // });

// // module.exports = mongoose.model('Booking', BookingSchema);
// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema({
//   user: { type: String, required: true },
//   text: { type: String, required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   createdAt: { type: Date, default: Date.now }
// });

// const Review = mongoose.model("Review", reviewSchema);

// export default Review;
