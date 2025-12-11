import { Alert } from "./Alert";
import Button from "./Button";
import Heading from "./Heading";
import Input from "./Input";
import Spinner from "./Spinner";
import VerifyEmail from "./VerifyEmail";
import ErrorBoundary from "./ErrorBoundary";
import MapControls from "./MapControls";

// Phase 4 - Re-export from new structure
export * from "./atoms";
export * from "./composed";
export * from "./layout";
export * from "./maps";

// Keep legacy exports for backward compatibility
export {
  Alert,
  Button,
  Heading,
  Input,
  Spinner,
  VerifyEmail,
  ErrorBoundary,
  MapControls,
};
