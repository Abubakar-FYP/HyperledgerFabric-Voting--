import styled from 'styled-components'


export const Container = styled.div`
padding: 80px 60px;
background: rgb(21,80,20);
background: linear-gradient(90deg, rgba(21,80,20,1) 0%, rgba(9,121,14,1) 69%, rgba(21,80,20,1) 100%);
`
export const Wrapper = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
max-width:1000px;
margin:0 auto;
`
export const Column = styled.div`
display:flex;
flex-direction:column;
text-align:left;
margin-left:60px;
`
export const Row = styled.div` 
display:grid;
grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
grid-gap: 20px;

@media (max-width:1000px){
    grid-template-columns:  repeat(auto-fill, minmax(200px, 1fr));
}

`
export const Link = styled.a` 
color: #fff;
margin-bottom:20px;
font-size:18px;
text-decoration: none;



&:hover{
    color: #ff9c00;
    transition: 200ms ease-in;
}

`
export const Title = styled.p`
font-size:24px;
color:#fff;
margin-bottom: 40px;
font-weight: bold;
`

