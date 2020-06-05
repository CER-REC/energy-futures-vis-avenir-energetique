import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './styles.scss';

class ErrorBoundary extends React.PureComponent {
  static propTypes = {
    // Default children props from react
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    // Dispatch an event to tell the LoadingGuide that we're mounted
    const event = new CustomEvent('LoadingGuide.enabled', { detail: false });
    window.dispatchEvent(event);
  }

  getRestoreLink = () => document.location.href;

  getResetLink = () => document.location.origin + document.location.pathname;

  render() {
    if (this.state.errorInfo) {
      const details = [
        this.state.errorInfo.componentStack,
        this.state.error.networkError,
        ...(this.state.error.graphQLErrors || []),
      ].filter(v => v);
      return (
        <section className="ErrorBoundary">
          <section className="errorMessage">
            <FormattedMessage id="components.errorBoundary.errorMessage" tagName="h1" />
          </section>
          <section className="restoreLink">
            <FormattedMessage id="components.errorBoundary.restoreMessage" />
            &nbsp;
            <a href={`${this.getRestoreLink()}`}>
              <FormattedMessage id="components.errorBoundary.restoreLinkText" />
            </a>
          </section>
          <section className="resetLink">
            <FormattedMessage id="components.errorBoundary.resetMessage" />&nbsp;
            <a href={`${this.getResetLink()}`}>
              <FormattedMessage id="components.errorBoundary.resetLinkText" />
            </a>
          </section>
          <section className="details">
            <details>
              {this.state.error && this.state.error.toString()}
              {details.map((v, i) => (
                <p key={i /* eslint-disable-line react/no-array-index-key */}>{v}</p>
              ))}
            </details>
          </section>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
