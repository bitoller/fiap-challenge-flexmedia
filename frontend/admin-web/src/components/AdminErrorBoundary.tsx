import { Component, type ReactNode } from "react";

type AdminErrorBoundaryProps = {
  children: ReactNode;
  resetKey: string;
  title: string;
  message: string;
  reloadLabel: string;
  loginLabel: string;
  onReload: () => void;
  onLogin: () => void;
};

type AdminErrorBoundaryState = {
  hasError: boolean;
};

class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  state: AdminErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AdminErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Admin render error", error);
  }

  componentDidUpdate(prevProps: AdminErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-shell admin-shell--login">
          <div className="admin-login-card">
            <p className="admin-eyebrow">{this.props.title}</p>
            <h1>{this.props.title}</h1>
            <p className="admin-copy">{this.props.message}</p>
            <div className="admin-login-form">
              <button className="admin-primary-button" type="button" onClick={this.props.onReload}>
                {this.props.reloadLabel}
              </button>
              <button className="admin-secondary-button" type="button" onClick={this.props.onLogin}>
                {this.props.loginLabel}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
