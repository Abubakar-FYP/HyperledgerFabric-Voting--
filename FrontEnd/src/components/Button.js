import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const Button = styled(Link)`

background: ${({primary })=>(primary ? '#008e53': 'CD853F')};
white-space:nowrap;
outline:none;
border:none;
min-width: 100px;
max-width: 200px;
cursor: pointer;
text-decoration:none;
transition: 0.3s;
display:flex;
justify-content:center;
align-items:center;
align-self:center;
padding: ${({big})=> (big ? '16px 40px': '10px 14px')}; 
color: ${({primary})=>(primary ? '#fff' : '#000d1a')};
font-size: ${({big})=> (big ? '20px' : '14px' )};
transition: 0.5s;

&:hover {
    background-color:white;
    color:green;
    transform: translateY(-2px);
    border-shadow:none;
    border:1px green solid;
}

`;