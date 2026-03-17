import  React , { Component,type ReactNode , type ErrorInfo} from "react";

interface Props { children: ReactNode ; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-wheat text-dark">
          <h1 className="text-2xl font-bold">Arre Bhai, Kuch toh gadbad ho gayi! 😅</h1>
          <p>Ludhiana ke servers thoda thak gaye hain, refresh karke dekho.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh Karo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;