import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Section from './Section';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import Section6 from './Section6';
import Section7 from './Section7';
import Section8 from './Section8';
import './bootstrap.min.css';
import './all.min.css';
import './swiper-bundle.min.css';
import './magnific-popup.css';
import './animate.css';
import './nice-select.css';
import './style.css';

function Home() {
  return (
    <div className="top__header pt-30 pb-30">
      <div className="container">
        <div className="top__wrapper">
          <a href="index.html" className="main__logo">
            <img src="assets/images/logo/logo.svg" alt="logo__image" />
          </a>
          <div className="search__wrp">
            <input placeholder="Search for" aria-label="Search" />
            <button><i className="fa-solid fa-search"></i></button>
            </div>
            <div className="account__wrap">
              <div className="account d-flex align-items-center">
                <div className="user__icon">
                  <a href="#0">
                    <i className="fa-regular fa-user"></i>
                    </a>
                  </div>
                  <a href="#0" className="acc__cont">
                    <span>
                      My Account
                    </span>
                  </a>
                </div>
                <div className="cart d-flex align-items-center">
                  <span className="cart__icon">
                    <i className="fa-regular fa-cart-shopping"></i>
                    </span>
                    <a href="#0" className="c__one">
                      <span>
                        $0.00
                      </span>
                    </a>
                    <span className="one">
                      0
                    </span>
                  </div>
                  <div className="flag__wrap">
                    <div className="flag">
                      <img src="assets/images/flag/us.png" alt="flag" />
                    </div>
                    <select name="flag">
                      <option value="0">
                        Usa
                      </option>
                      <option value="1">
                        Canada
                      </option>
                      <option value="2">
                        Australia
                      </option>
                      <option value="3">
                        Germany
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Header />

          <div className="mouse-cursor cursor-outer"></div>
            <div className="mouse-cursor cursor-inner"></div>


              <main>


                <Section />



                <Section2 />



                <Section3 />



                <Section4 />



                <Section5 />



                <Section6 />



                <div className="container">
                  <div className="bor-top pb-40"></div>
                  </div>
                  <div className="marquee-wrapper text-slider">
                    <div className="marquee-inner to-left">
                      <ul className="marqee-list d-flex">
                        <li className="marquee-item">
                          E-Cigarettes <img src="assets/images/icon/title-left.svg" alt="icon" /> <span>Vape Pens</span>
                          <img src="assets/images/icon/title-left.svg" alt="icon" />
                          Vape Juice <img src="assets/images/icon/title-left.svg" alt="icon" /> <span>E-Cigarettes</span>
                          <img src="assets/images/icon/title-left.svg" alt="icon" />
                          Vape Pens <img src="assets/images/icon/title-left.svg" alt="icon" /> <span>Vape Juice</span>
                          <img src="assets/images/icon/title-left.svg" alt="icon" />
                          E-Cigarettes <img src="assets/images/icon/title-left.svg" alt="icon" /> <span>Vape Pens</span>
                          <img src="assets/images/icon/title-left.svg" alt="icon" />
                          Vape Juice <img src="assets/images/icon/title-left.svg" alt="icon" /> <span>E-Cigarettes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="container">
                    <div className="bor-top pb-65"></div>
                    </div>



                    <Section7 />



                    <Section8 />

                  </main>


                  <Footer />



                  <div className="scroll-up">
                    <svg className="scroll-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
                      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                    </svg>
                  </div>
























  );
}

export default Home;
