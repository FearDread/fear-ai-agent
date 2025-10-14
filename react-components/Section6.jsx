import React from 'react';

function Section6() {
  return (
    <section className="get-now-area pt-130 pb-130">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6">
            <h4 className="mb-30 wow fadeInUp" data-wow-delay=".1s"><img src="assets/images/icon/fire.svg"
              alt="icon" />
              GET <span className="primary-color">25% OFF</span> NOW</h4>
              <div className="section-header d-flex align-items-center wow fadeInUp" data-wow-delay=".2s">
                <span className="title-icon mr-10"></span>
                  <h2>latest arrival products</h2>
                  </div>
                  <div className="get-now__content">
                    <div className="get-info py-4 wow fadeInUp" data-wow-delay=".2s">
                      <del>$99.00</del> <span>$49.00</span>
                      </div>
                      <p className="fw-600 wow fadeInUp" data-wow-delay=".3s">There are many variations of passages of
                        Lorem Ipsum available, but <br />
                        the
                        majority have
                        suffered alteration in some form,
                        by injected humour, or randomised words which</p>
                        <ul className="pt-30 pb-30 bor-bottom wow fadeInUp" data-wow-delay=".3s">
                          <li>100% Natural</li>
                            <li>Coupon $61.99, Code: W2</li>
                              <li>30 Day Refund</li>
                              </ul>
                              <div className="time-up d-flex flex-wrap align-items-center gap-5 mt-30 wow fadeInUp"
                                data-wow-delay=".4s">
                                <div className="info">
                                  <h4>HUNGRY UP !</h4>
                                    <span>Offer end in :</span>
                                    </div>
                                    <div className="d-flex gap-2 align-items-center">
                                      <div className="get-time">
                                        <h3 id="day">00</h3>
                                          <span>Day</span>
                                          </div>
                                          <div className="get-time">
                                            <h3 id="hour">00</h3>
                                              <span>Hr</span>
                                              </div>
                                              <div className="get-time">
                                                <h3 id="min">00</h3>
                                                  <span>Min</span>
                                                  </div>
                                                  <div className="get-time">
                                                    <h3 id="sec">00</h3>
                                                      <span>Sec</span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-xl-6">
                                                <div className="get-now__image mt-5 mt-xl-0">
                                                  <div className="get-bg-image">
                                                    <img src="assets/images/shop/get-bg.png" alt="image" />
                                                  </div>
                                                  <div className="swiper get__slider">
                                                    <div className="swiper-wrapper">
                                                      <div className="swiper-slide">
                                                        <div className="image">
                                                          <img src="assets/images/shop/get-image.png" alt="image" />
                                                        </div>
                                                      </div>
                                                      <div className="swiper-slide">
                                                        <div className="image">
                                                          <img src="assets/images/shop/get-image2.png" alt="image" />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <button className="get-now-arry get-now__arry-left">
                                                    <i className="fa-light fa-chevron-left"></i>
                                                    </button>
                                                    <button className="get-now-arry get-now__arry-right text-warning">
                                                      <i className="fa-light fa-chevron-right"></i>
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </section>
  );
}

export default Section6;
