import React from 'react'
import Footer from '../components/footer'
import { Icon } from '../components/icons/styles/icons'

export function FooterContainer(){
    return (
        <Footer>
            <Footer.Wrapper>
                <Footer.Row>
                <Footer.Column>
                    <Footer.Title>About Us</Footer.Title>
                    <Footer.Link href="#">Story</Footer.Link>
                    <Footer.Link href="#">Client</Footer.Link>
                    <Footer.Link href="#">Testimonials</Footer.Link>
                </Footer.Column>
                <Footer.Column>
                    <Footer.Title>Services</Footer.Title>
                    <Footer.Link href="#">Marketing</Footer.Link>
                    <Footer.Link href="#">Consulting</Footer.Link>
                    <Footer.Link href="#">Development</Footer.Link>
                    <Footer.Link href="#">Design</Footer.Link>
                </Footer.Column>

                <Footer.Column>
                    <Footer.Title>Contact Us</Footer.Title>
                    <Footer.Link href="#">Lahore</Footer.Link>
                    <Footer.Link href="#">Islamabad</Footer.Link>
                    <Footer.Link href="#">Karachi</Footer.Link>
                    <Footer.Link href="#">KPK</Footer.Link>
                </Footer.Column>

                <Footer.Column>
                    <Footer.Title>Social</Footer.Title>
                    <Footer.Link href="#"><Icon className="fab fa-facebook-f"/>Facebook</Footer.Link>
                    <Footer.Link href="#"><Icon className="fab fa-twitter"/>Twitter</Footer.Link>
                    <Footer.Link href="#"><Icon className="fab fa-instagram"/>Instagram</Footer.Link>
                    <Footer.Link href="#"><Icon className="fab fa-youtube"/>YouTube</Footer.Link>
                </Footer.Column>
                </Footer.Row>
            </Footer.Wrapper>
        </Footer>
    )
}