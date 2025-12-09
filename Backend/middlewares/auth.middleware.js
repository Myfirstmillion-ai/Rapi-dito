const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Blacklisted Unauthorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decoded.id }).populate("rides");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = {
      _id: user._id,
      fullname: {
        firstname: user.fullname.firstname,
        lastname: user.fullname.lastname,
      },
      email: user.email,
      phone: user.phone,
      rides: user.rides,
      socketId: user.socketId,
      emailVerified: user.emailVerified || false,
      profileImage: user.profileImage || "",
      rating: user.rating || { average: 0, count: 0 },
    };
    req.userType = "user";

    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      return res.status(401).json({ message: "Unauthorized User", error });
    }
  }
};

module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized User" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel
      .findOne({ _id: decoded.id })
      .populate("rides");
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    req.captain = {
      _id: captain._id,
      fullname: {
        firstname: captain.fullname.firstname,
        lastname: captain.fullname.lastname,
      },
      email: captain.email,
      phone: captain.phone,
      rides: captain.rides,
      socketId: captain.socketId,
      emailVerified: captain.emailVerified,
      vehicle: captain.vehicle,
      status: captain.status,
      profileImage: captain.profileImage || "",
      rating: captain.rating || { average: 0, count: 0 },
    };
    req.userType = "captain";
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token Expired" });
    } else {
      return res.status(401).json({ message: "Unauthorized User", error });
    }
  }
};

// Admin authentication middleware - RBAC with database-driven admin status
module.exports.authAdmin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Acceso de administrador no autorizado" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Acceso de administrador no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists (can be either user or captain)
    let adminUser = await userModel.findOne({ _id: decoded.id });
    if (!adminUser) {
      adminUser = await captainModel.findOne({ _id: decoded.id });
    }

    if (!adminUser) {
      return res.status(401).json({ message: "Acceso de administrador no autorizado" });
    }

    // SECURITY FIX: Check database isAdmin field first (proper RBAC)
    let hasAdminAccess = adminUser.isAdmin === true;

    // Fallback: Super Admin email check (only if SUPER_ADMIN_EMAIL is explicitly set)
    // This provides a bootstrap mechanism for the first admin
    if (!hasAdminAccess && process.env.SUPER_ADMIN_EMAIL) {
      const SUPER_ADMIN_EMAILS = [process.env.SUPER_ADMIN_EMAIL];
      hasAdminAccess = SUPER_ADMIN_EMAILS.includes(adminUser.email);
    }

    if (!hasAdminAccess) {
      return res.status(403).json({ message: "Acceso denegado: Se requieren privilegios de administrador" });
    }

    req.admin = {
      _id: adminUser._id,
      email: adminUser.email,
      fullname: adminUser.fullname,
      isAdmin: adminUser.isAdmin,
    };

    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token expirado" });
    } else {
      return res.status(401).json({ message: "Acceso de administrador no autorizado", error });
    }
  }
};

// Authentication middleware for endpoints accessible by both users and captains
module.exports.authUserOrCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token en lista negra" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find user first
    let user = await userModel.findOne({ _id: decoded.id }).populate("rides");
    if (user) {
      req.user = {
        _id: user._id,
        fullname: {
          firstname: user.fullname.firstname,
          lastname: user.fullname.lastname,
        },
        email: user.email,
        phone: user.phone,
        rides: user.rides,
        socketId: user.socketId,
        emailVerified: user.emailVerified || false,
        profileImage: user.profileImage || "",
        rating: user.rating || { average: 0, count: 0 },
      };
      req.userType = "user";
      return next();
    }

    // Try to find captain if user not found
    let captain = await captainModel.findOne({ _id: decoded.id }).populate("rides");
    if (captain) {
      req.captain = {
        _id: captain._id,
        fullname: {
          firstname: captain.fullname.firstname,
          lastname: captain.fullname.lastname,
        },
        email: captain.email,
        phone: captain.phone,
        rides: captain.rides,
        socketId: captain.socketId,
        emailVerified: captain.emailVerified,
        vehicle: captain.vehicle,
        status: captain.status,
        profileImage: captain.profileImage || "",
        rating: captain.rating || { average: 0, count: 0 },
      };
      req.userType = "captain";
      return next();
    }

    // Neither user nor captain found
    return res.status(401).json({ message: "Usuario no encontrado" });
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Token expirado" });
    } else {
      return res.status(401).json({ message: "No autorizado", error });
    }
  }
};
