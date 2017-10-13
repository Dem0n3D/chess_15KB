import React from 'react';
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
//Enzyme.configure({ adapter: new Adapter() });


import {WhiteFigure, BlackFigure} from "../index";


it('should render a figure', () => {
    const wq = renderer.create(
        <WhiteFigure text="♛" />
    );
    expect(wq).toMatchSnapshot();

    const bk = renderer.create(
        <BlackFigure text="♚" />
    );
    expect(bk).toMatchSnapshot();
});
