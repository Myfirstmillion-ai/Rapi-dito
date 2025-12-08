const asyncHandler = require("express-async-handler");
const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");

// Get all captains with their membership status
module.exports.getAllCaptains = asyncHandler(async (req, res) => {
  const captains = await captainModel
    .find({})
    .select(
      "fullname email phone vehicle isMembershipActive membershipPlan membershipExpiresAt status emailVerified profileImage rating createdAt"
    )
    .sort({ createdAt: -1 });

  res.status(200).json({ 
    captains,
    count: captains.length 
  });
});

// Toggle captain membership status
module.exports.toggleCaptainStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const { id } = req.params;
  const { isMembershipActive, membershipPlan, membershipExpiresAt } = req.body;

  const captain = await captainModel.findById(id);
  if (!captain) {
    return res.status(404).json({ message: "Captain not found" });
  }

  // Update membership fields
  if (typeof isMembershipActive !== "undefined") {
    captain.isMembershipActive = isMembershipActive;
  }
  
  if (membershipPlan) {
    captain.membershipPlan = membershipPlan;
  }
  
  if (membershipExpiresAt) {
    captain.membershipExpiresAt = membershipExpiresAt;
  }

  await captain.save();

  res.status(200).json({
    message: "Captain status updated successfully",
    captain: {
      _id: captain._id,
      fullname: captain.fullname,
      email: captain.email,
      isMembershipActive: captain.isMembershipActive,
      membershipPlan: captain.membershipPlan,
      membershipExpiresAt: captain.membershipExpiresAt,
    },
  });
});
