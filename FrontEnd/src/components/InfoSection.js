import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';


const Section = styled.section`
width: 100%;
height: 100%
padding: 4rem 0rem;
margin-top:3rem;
margin-bottom:3rem;
`;
const Container= styled.div`
padding: 3rem calc((100vw-1300px)/2);
display:grid;
grid-template-columns: 1fr 1fr;

a{
    position:absolute;
    top:1050px;
    left:33px;
}

@media screen and (max-width: 768px){
    grid-template-columns:1fr
}
`;
const ColumnLeft = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items: flex-start;
line-height: 1.4;
height:500px;
padding: 1rem 2rem;
order:${({reverse}) => (reverse ? '2' : '1')};

h1{
    margin-bottom: 1rem;
    font-size: clamp(1.5rem, 6vw, 2rem);
}

p{
    margin-bottom:2rem;
}

`;
const ColumnRight = styled.div`
padding: 1rem 2rem;
order:${({reverse}) => (reverse ? '1' : '2')};
display:flex;
justify-content:center;
align-items:center;
height:500px;
box-sizing:border-box;

@media screen and (max-width: 768px){
    order:${({reverse}) => (reverse ? '2' : '1')};
}

img{
    width:100%;
    height:100%;
    object-fit:contain;
    
    @media screen and (max-width:768px){
        width:90%;
        height:90%;
    }

}

`;


const InfoSection = ({heading,ParagraphOne,ParagraphTwo,buttonLabel,reverse,image}) => {
    return (
       <Section>
           <Container>
               <ColumnLeft>
               <h1>{heading}</h1>
               <p>{ParagraphOne}</p>
               <p>{ParagraphTwo}</p>
               <Button to='/Team' primary= 'true'>{buttonLabel}</Button>
               </ColumnLeft>
           <ColumnRight reverse={reverse}>
           <img src = {image} alt='home'/>
           </ColumnRight>
           </Container>
       </Section>
    )
}

export default InfoSection
