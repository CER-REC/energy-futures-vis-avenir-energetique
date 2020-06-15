import React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from '.';

describe('Components|ErrorBoundary', () => {
  let wrapper;
  let goodChildWrapper;
  let ProblemChild;
  let GoodChild;

  describe('with default props', () => {
    beforeEach(() => {
      ProblemChild = () => {
        throw new Error('Error thrown from problem child');
      };
      GoodChild = () => <div>I am the good child</div>;
      wrapper = shallow(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>,
      );
      goodChildWrapper = shallow(
        <ErrorBoundary>
          <GoodChild />
        </ErrorBoundary>,
      );
    });
    describe('Should have render the ErrorBoundary', () => {
      test('check state errorInfo is not null', () => {
        expect(wrapper.prop('errorInfo')).not.toBeNull();
      });
    });
    describe('Should not fail and render the childs', () => {
      test('Good Child is there', () => {
        expect(goodChildWrapper.childAt(0).type()).toEqual(GoodChild);
      });
    });
  });
});
