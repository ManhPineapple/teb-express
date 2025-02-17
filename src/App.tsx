import { ToastContainer } from "react-toastify";
import AppProvider from "./providers";
import AppRouter from "./routes";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer/>
    </AppProvider>
  );
}
