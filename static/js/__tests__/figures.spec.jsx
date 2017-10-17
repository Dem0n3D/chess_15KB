import React from 'react';
import renderer from 'react-test-renderer'
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() })


import {WhiteFigure, BlackFigure, Board} from "../index";


it('should render a figure', () => {
    const wq = render(
        <WhiteFigure text="♛" />
    );
    expect(wq).toMatchSnapshot();

    const bk = render(
        <BlackFigure text="♚" />
    );
    expect(bk).toMatchSnapshot();
});

it('should render a board', () => {
    const board = [[{"color":"black","text":"\u265c"},{"color":"black","text":"\u265e"},{"color":"black","text":"\u265d"},{"color":"black","text":"\u265b"},{"color":"black","text":"\u265a"},{"color":"black","text":"\u265d"},{"color":"black","text":"\u265e"},{"color":"black","text":"\u265c"}],[{"color":"black","text":"\u265f"},{"color":"black","text":"\u265f"},{"color":"black","text":"\u265f"},{"color":"black","text":"\u265f"},{"color":"black","text":"\u265f"},null,{"color":"black","text":"\u265f"},{"color":"black","text":"\u265f"}],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,{"color":"white","text":"\u265f"},null],[null,null,null,null,null,null,null,null],[null,null,null,null,{"color":"black","text":"\u265f"},null,null,null],[{"color":"white","text":"\u265f"},{"color":"white","text":"\u265f"},{"color":"white","text":"\u265f"},{"color":"white","text":"\u265f"},null,{"color":"white","text":"\u265f"},null,{"color":"white","text":"\u265f"}],[{"color":"white","text":"\u265c"},{"color":"white","text":"\u265e"},{"color":"white","text":"\u265d"},{"color":"white","text":"\u265b"},{"color":"white","text":"\u265a"},{"color":"white","text":"\u265d"},{"color":"white","text":"\u265e"},{"color":"white","text":"\u265c"}]];

    const b = render(
        <Board board={board} moves={[]} selected={undefined} />
    );
    expect(b).toMatchSnapshot();
});
