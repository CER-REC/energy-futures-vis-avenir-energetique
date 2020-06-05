import React from 'react';
import { storiesForView } from '../../../.storybook/utils';
import ReadMe from './README.md';
import App from '.';
import ErrorBoundary from '../../components/ErrorBoundary';

storiesForView('Containers|App', module, ReadMe)
  .add('default', () => <App />)
  .add('within WET', () => (
    /* eslint-disable react/no-unescaped-entities, react/self-closing-comp */
    /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
    /* eslint-disable max-len */
    <>
      <link
        rel="stylesheet"
        href="./themes-dist-4.0.20-theme-gcwu-fegc/theme-gcwu-fegc/css/theme.min.css"
      />
      <ul id="wb-tphp">
        <li className="wb-slc">
          <a className="wb-sl" href="#wb-cont">Skip to main content</a>
        </li>
        <li className="wb-slc visible-sm visible-md visible-lg">
          <a className="wb-sl" href="#wb-info">Skip to "About this site"</a>
        </li>
      </ul>
      <header role="banner">
        <div id="wb-bnr">
          <div id="wb-bar">
            <div className="container">
              <div className="row">
                <object id="gcwu-sig" type="image/svg+xml" tabIndex="-1" role="img" data="./themes-dist-4.0.20-theme-gcwu-fegc/theme-gcwu-fegc/assets/sig-en.svg" aria-label="Government of Canada" />
                <ul id="gc-bar" className="list-inline">
                  <li><a href="http://www.canada.ca/en/index.html" rel="external">Canada.ca</a></li>
                  <li><a href="http://www.canada.ca/en/services/index.html" rel="external">Services</a></li>
                  <li><a href="http://www.canada.ca/en/gov/dept/index.html" rel="external">Departments</a></li>
                  <li id="wb-lng"><h2>Language selection</h2>
                    <ul className="list-inline">
                      <li><a href="content-fr.html">Français</a></li>
                    </ul>
                  </li>
                </ul>
                <section className="wb-mb-links col-xs-12 visible-sm visible-xs" id="wb-glb-mn">
                  <h2>Search and menus</h2>
                  <ul className="pnl-btn list-inline text-right">
                    <li><a href="#mb-pnl" title="Search and menus" aria-controls="mb-pnl" className="overlay-lnk btn btn-sm btn-default" role="button"><span className="glyphicon glyphicon-search"><span className="glyphicon glyphicon-th-list"><span className="wb-inv">Search and menus</span></span></span></a></li>
                  </ul>
                  <div id="mb-pnl"></div>
                </section>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div id="wb-sttl" className="col-md-5">
                <a href="http://wet-boew.github.io/v4.0-ci/index-en.html">
                  <span>Web Experience Toolkit</span>
                </a>
              </div>
              <object id="wmms" type="image/svg+xml" tabIndex="-1" role="img" data="./themes-dist-4.0.20-theme-gcwu-fegc/theme-gcwu-fegc/assets/wmms.svg" aria-label="Symbol of the Government of Canada"></object>
              <section id="wb-srch" className="visible-md visible-lg">
                <h2>Search</h2>
                <form action="https://google.ca/search" method="get" role="search" className="form-inline">
                  <div className="form-group">
                    <label htmlFor="wb-srch-q">Search website</label>
                    <input id="wb-srch-q" className="form-control" name="q" type="search" defaultValue="" size="27" maxLength="150" />
                    <input type="hidden" name="q" defaultValue="site:wet-boew.github.io OR site:github.com/wet-boew/" />
                  </div>
                  <button type="submit" id="wb-srch-sub" className="btn btn-default">Search</button>
                </form>
              </section>
            </div>
          </div>
        </div>
        <nav role="navigation" id="wb-sm" data-ajax-replace="./themes-dist-4.0.20-theme-gcwu-fegc/ajax/sitemenu-en.html" data-trgt="mb-pnl" className="wb-menu visible-md visible-lg" typeof="SiteNavigationElement">
          <div className="container nvbar">
            <h2>Topics menu</h2>
            <div className="row">
              <ul className="list-inline menu">
                <li><a href="./themes-dist-4.0.20-theme-gcwu-fegc/index-en.html">WET project</a></li>
                <li><a href="./themes-dist-4.0.20-theme-gcwu-fegc/docs/start-en.html#implement">Implement WET</a></li>
                <li><a href="./themes-dist-4.0.20-theme-gcwu-fegc.docs/start-en.html">Contribute to WET</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <nav role="navigation" id="wb-bc" property="breadcrumb">
          <h2>You are here:</h2>
          <div className="container">
            <div className="row">
              <ol className="breadcrumb">
                <li>
                  <a href="http://wet-boew.github.io/v4.0-ci/index-en.html">Home</a>
                </li>
                <li>
                  <a href="http://wet-boew.github.io/v4.0-ci/demos/index-en.html">Working examples</a>
                </li>
                <li>
                  <a href="index-en.html">GCWU theme</a>
                </li>
                <li>Content page</li>
              </ol>
            </div>
          </div>
        </nav>
      </header>

      <main role="main" property="mainContentOfPage" className="container">
        <App />
      </main>

      <footer role="contentinfo" id="wb-info" className="visible-sm visible-md visible-lg wb-navcurr">
        <div className="container">
          <nav role="navigation">
            <h2>About this site</h2>
            <ul id="gc-tctr" className="list-inline">
              <li><a rel="license" href="http://wet-boew.github.io/wet-boew/License-en.html">Terms and conditions</a></li>
              <li><a href="http://www.tbs-sct.gc.ca/tbs-sct/common/trans-eng.asp">Transparency</a></li>
            </ul>
            <div className="row">
              <section className="col-sm-3">
                <h3>Contact us</h3>
                <ul className="list-unstyled">
                  <li><a href="https://github.com/wet-boew/wet-boew/issues/new">Questions or comments?</a></li>
                </ul>
              </section>
              <section className="col-sm-3">
                <h3>About</h3>
                <ul className="list-unstyled">
                  <li><a href="http://wet-boew.github.io/v4.0-ci/index-en.html#about">About the Web Experience Toolkit</a></li>
                  <li><a href="http://www.tbs-sct.gc.ca/ws-nw/index-eng.asp">About the Web Standards</a></li>
                </ul>
              </section>
              <section className="col-sm-3">
                <h3>News</h3>
                <ul className="list-unstyled">
                  <li><a href="https://github.com/wet-boew/wet-boew/pulse">Recent project activity</a></li>
                  <li><a href="https://github.com/wet-boew/wet-boew/graphs">Project statistics</a></li>
                </ul>
              </section>
              <section className="col-sm-3">
                <h3>Stay connected</h3>
                <ul className="list-unstyled">
                  <li><a href="https://twitter.com/WebExpToolkit">Twitter</a></li>
                </ul>
              </section>
            </div>
          </nav>
        </div>
        <div id="gc-info">
          <div className="container">
            <nav role="navigation">
              <h2>Government of Canada footer</h2>
              <ul className="list-inline">
                <li><a href="http://healthycanadians.gc.ca"><span>Health</span></a></li>
                <li><a href="http://travel.gc.ca"><span>Travel</span></a></li>
                <li><a href="http://www.servicecanada.gc.ca/eng/home.shtml"><span>Service Canada</span></a></li>
                <li><a href="http://www.jobbank.gc.ca"><span>Jobs</span></a></li>
                <li><a href="http://actionplan.gc.ca/en"><span>Economy</span></a></li>
                <li id="canada-ca"><a href="http://www.canada.ca/en/index.html">Canada.ca</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
      <script src="./themes-dist-4.0.20-theme-gcwu-fegc/wet-boew/js/wet-boew.min.js"></script>
      <script src="./themes-dist-4.0.20-theme-gcwu-fegc/theme-gcwu-fegc/js/theme.min.js"></script>
    </>
    /* eslint-enable */
  ))
  .add('WithErrors', () => {
    const BuggyComponent = () => {
      throw new Error('I crashed!');
    };

    return (
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );
  });
