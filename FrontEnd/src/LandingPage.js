import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./components/Navbar";
const LandingPage = () => {
  return (
    <div>
      {/* <span id="homes" /> */}
      <section id='showcase'>
        <div className='showcase-content'>
          <h1 className='main-heading'>
            Dont't Let Your Childern Future to Go In Dark
          </h1>
          <p className='main-para'>
            Your voices are being heard and you’re proving to our ancestors that
            their struggles were not in vain. Now we have one more thing we need
            to do to walk in our true power, and that is to vote.
          </p>
          <Link to='/signin' className='btn'>
            Vote
          </Link>
        </div>
      </section>
      <section id='what'>
        <div className='container'>
          <h1 id='whats'>
            <span className='text-primary'></span> Features{" "}
          </h1>
        </div>
        <div className='whats'>
          <div className='investment what'>
            <div className='icon'>
              <i className='far fa-lightbulb fa-4x'></i>
            </div>
            <div className='info'>
              <h1>Transparent voting</h1>
              <p>
                Our Voting system is a blockchain based system and it provides a
                transparent voting system, eliminatede the problem of vote
                tempering
              </p>
            </div>
          </div>
          <div className='portfolio what'>
            <div className='icon'>
              <i className='fas fa-user-alt fa-4x'></i>{" "}
            </div>
            <div className='info'>
              <h1>KYC</h1>
              <p>
                We have introduced the decentralized KYC of the voters so no
                double voting can be done through the system and eliminated the
                fake vote count
              </p>
            </div>
          </div>
          <div className='tax what'>
            <div className='icon'>
              <i className='fas fa-layer-group fa-4x'></i>{" "}
            </div>
            <div className='info'>
              <h1>DEVELOPED COUNTRY</h1>
              <p>
                Our voting system will result a loyal election and a true leader
                will be elected that will put the country on the way of
                development{" "}
              </p>
            </div>
          </div>
        </div>

        <div className='whats'>
          <div className='investment what'>
            <div className='icon'>
              <i className='far fa-sun  fa-4x'></i>
            </div>
            <div className='info'>
              <h1>FUTURE</h1>
              <p>
                Learn how to take beautiful portraits with minimal equipment;
                how light affects your images and how to make the very best of
                any location.
              </p>
            </div>
          </div>
          <div className='portfolio what'>
            <div className='icon'>
              <i className='fas fa-database fa-4x'></i>
            </div>
            <div className='info'>
              <h1>BLOCKCHAIN</h1>
              <p>
                Our Voting system is a blockchain based system and it provides a
                transparent voting system, eliminatede the problem of vote
                tempering
              </p>
            </div>
          </div>
          <div className='tax what'>
            <div className='icon'>
              <i className='fas fa-dice-d20 fa-4x'></i>
            </div>
            <div className='info'>
              <h1>DECENTRALIZED</h1>
              <p>
                Our voting application is completely decentralized and this
                results to the elimination of the interfarence of any person in
                voting results
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id='who'>
        <div className='left-img who'></div>
        <div className='right-content who'>
          <h1 className='who-info'>
            <span className='text-primary'>
              Our <span className='text-light'>Mission</span>{" "}
            </span>
          </h1>
          <p className='who-info'>
            As after seeing so much problems and corruption in our voting
            system, our team com out with the plan to transform the voting
            system of Pakistan and shifting the system from the standard paper
            voting to decnetralized voting system, where the whole voting system
            will be transparent to the users and the voters will be easily cast
            the vote from any where the world, Our application provides a hastle
            free and visible voting and the user will be able to see results on
            run time
          </p>
          <p className='who-info'>
            So, our mission was to introduce a fair way of election in Pakistan
            so a fair leadership is been elected and as by introducing the
            blockchain the system becomes totally transparent for all the users
            and now as every vote casted is been mapped to the blockchain and in
            the result a transparent and a fair election will take place a true
            leadership will be elected that can govern the country and make it
            grow.
          </p>
        </div>
      </section>
      <section id='clients'>
        <div className='container'>
          <h1 id='client'>
            <span className='text-primary'>Our</span> Team
          </h1>
        </div>
        <div className='clients'>
          <div className='client'>
            <img
              src='/img/logos/WhatsAppImage2021-10-18at1.08.01AM.jpeg'
              alt='Client'
            />
          </div>

          <div className='client'>
            <img src='/img/logos/murtaza.png' alt='Client' />
          </div>

          <div className='client'>
            <img
              src='/img/logos/WhatsAppImage2021-10-18at12.53.07AM.jpeg'
              alt='Client'
            />
          </div>

          <div className='client'>
            <img
              src='https://pak-vote.herokuapp.com/img/logos/WhatsAppImage2021-10-18at12.53.07AM1.jpeg'
              alt='Client'
            />
          </div>
        </div>
      </section>
      <section id='contact'>
        <div className='form'>
          <h1 className='text-primary'>
            Contact <span className='text-light'>Us</span>{" "}
          </h1>
          <form>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input type='text' name='name' id='name' />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' name='email' id='email' />
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Phone</label>
              <input type='text' name='phone' id='phone' />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>Message</label>
              <textarea
                name='message'
                id='message'
                cols={10}
                rows={3}
                defaultValue={""}
              />
            </div>
            <input type='submit' defaultValue='Submit' />
          </form>
        </div>
        <div className='map' />
      </section>
      <footer>
        <p>Copyright ©, 2021, Pakistan Voting System</p>
      </footer>
    </div>
  );
};

export default LandingPage;
