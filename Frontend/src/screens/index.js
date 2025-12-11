import GetStarted from "./GetStarted";

import UserSignup from "./UserSignup";
import CaptainSignup from "./CaptainSignup";

import UserLogin from "./UserLogin";
import CaptainLogin from "./CaptainLogin";

// Phase 4 - New Luxury Screens
import UserHomeScreen from "./user/UserHomeScreen";
import RideBookingFlow from "./user/RideBookingFlow";
import ActiveRideScreen from "./user/ActiveRideScreen";

import CaptainHomeScreen from "./captain/CaptainHomeScreen";
import CaptainActiveRide from "./captain/CaptainActiveRide";
import RideRequestOverlay from "./captain/RideRequestOverlay";

import ChatScreen from "./shared/ChatScreen";
import RideHistoryScreen from "./shared/RideHistoryScreen";
import ProfileScreen from "./shared/ProfileScreen";

// Keep old imports for backward compatibility
import UserProtectedWrapper from "./UserProtectedWrapper";
import CaptainProtectedWrapper from "./CaptainProtectedWrapper";

import UserEditProfile from "./UserEditProfile";
import CaptainEditProfile from "./CaptainEditProfile";

import Error from "./Error";
import VerifyEmail from "./VerifyEmail";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";

import AboutUs from "./AboutUs";
import Blog from "./Blog";
import Careers from "./Careers";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Help from "./Help";

import AdminDashboard from "./AdminDashboard";

export {
  GetStarted,
  UserSignup,
  CaptainSignup,
  UserLogin,
  CaptainLogin,
  // Phase 4 - New Luxury Screens
  UserHomeScreen,
  RideBookingFlow,
  ActiveRideScreen,
  CaptainHomeScreen,
  CaptainActiveRide,
  RideRequestOverlay,
  ChatScreen,
  RideHistoryScreen,
  ProfileScreen,
  // Old screens (backward compatibility)
  UserProtectedWrapper,
  CaptainProtectedWrapper,
  UserEditProfile,
  CaptainEditProfile,
  Error,
  VerifyEmail,
  ResetPassword,
  ForgotPassword,
  AboutUs,
  Blog,
  Careers,
  Terms,
  Privacy,
  Help,
  AdminDashboard
};
