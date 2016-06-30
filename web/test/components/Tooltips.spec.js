import React from 'react';
import expect from 'expect';
import {shallow, mount, render} from 'enzyme';
import TooltipsComponent from '../../src/components/Tooltips.jsx';
import sinon from 'sinon';

describe('Tooltips Component', () => {
  it('should have an initial state', () => {
    const component = shallow(<TooltipsComponent />);
    expect(component.state('reticle')).toBe(true);
    expect(component.state('markers')).toBe(undefined);
  });
  describe('Walk through of tools', () => {
    const actionSpy = sinon.spy();
    const component = mount(<TooltipsComponent closeAction={actionSpy}/>);
    it('should move forward on user acknowledgment', () => {
      component.find('button').simulate('click');
      expect(component.state('markers')).toBe(true);
    });
    it('should called closeAction property', () => {
      component.find('button').simulate('click');
      expect(actionSpy.called).toBe(true);
    });
  });
});
