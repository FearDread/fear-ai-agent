import React from 'react';

function Section3() {
  return (
    <section className="view-area">
      <div className="bg-image view__bg" data-background="assets/images/bg/view-bg.jpg"></div>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay=".1s">
              <div className="view__left-item">
                <div className="image">
                  <img src="assets/images/view/view-image1.jpg" alt="image" />
                </div>
                <div className="view__left-content sub-bg">
                  <h2><a className="primary-hover" href="shop-single.html">The best e-liqued bundles</a>
                  </h2>
                  <p className="fw-600">Sell globally in minutes with localized currencies languages, and
                    experie
                    in every market. only a variety of vaping
                    products</p>
                    <a className="btn-two" href="shop-single.html"><span>Shop Now</span></a>
                      <a className="off-btn" href="#0"><img className="mr-10" src="assets/images/icon/fire.svg"
                        alt="icon" /> GET
                        <span className="primary-color">25%
                          OFF</span> NOW</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="view__item mb-25 wow fadeInDown" data-wow-delay=".2s">
                        <div className="view__content">
                          <h3><a className="primary-hover" href="shop-single.html">new to vapeing?</a></h3>
                            <p>Whereas recognition of the inherent dignity</p>
                              <a className="btn-two" href="shop-single.html"><span>Shop Now</span></a>
                              </div>
                              <div className="view__image">
                                <img src="assets/images/view/view-image2.jpg" alt="image" />
                              </div>
                            </div>
                            <div className="view__item wow fadeInUp" data-wow-delay=".3s">
                              <div className="view__content">
                                <h3><a className="primary-hover" href="shop-single.html">Vap mode</a></h3>
                                  <p>Whereas recognition of the inherent dignity</p>
                                    <a className="btn-two" href="shop-single.html"><span>Shop Now</span></a>
                                    </div>
                                    <div className="view__image">
                                      <img src="assets/images/view/view-image3.jpg" alt="image" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
  );
}

export default Section3;
