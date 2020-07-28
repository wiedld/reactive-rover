import * as React from 'react';
import { render } from 'react-dom';

const template = React.createElement('p', {}, 'Hello from react');

render(template, document.getElementById('root'));

