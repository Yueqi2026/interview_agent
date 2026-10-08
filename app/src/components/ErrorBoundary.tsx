import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = { children: ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, message: error.message }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Application rendering error', error, info); }
  render() {
    if (this.state.hasError) return <section className="page section wide-top"><div className="app-error fresh-card"><h1>页面暂时无法显示</h1><p className="muted">页面没有加载完成。请返回探索页后重试；如果问题持续，请稍后刷新页面。</p><p className="app-error-detail">{this.state.message || '未知渲染错误'}</p><Link className="btn primary" to="/discover" onClick={() => this.setState({ hasError: false })}>返回探索过来人</Link></div></section>;
    return this.props.children;
  }
}
