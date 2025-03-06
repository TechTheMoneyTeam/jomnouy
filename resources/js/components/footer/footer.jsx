import React from 'react';
import { FaFacebookF } from "react-icons/fa";


const Footers = () => (
               <footer className="footer">
                              <div className="footer-grid">
                                             <div>
                                                            <h3 className="footer-title">About Us</h3>
                                                            <ul className="footer-list">
                                                                           <li><Link to="#" className="footer-link">How It Works</Link></li>
                                                                           <li><Link to="#" className="footer-link">Why Jomnouy</Link></li>
                                                                           <li><Link to="#" className="footer-link">Success Stories</Link></li>
                                                                           <li><Link to="#" className="footer-link">Contact</Link></li>
                                                                           <li><Link to="#" className="footer-link">Partners</Link></li>
                                                            </ul>
                                             </div>
                                             <div>
                                                            <h3 className="footer-title">Resources</h3>
                                                            <ul className="footer-list">
                                                                           <li><Link to="#" className="footer-link">Pricing</Link></li>
                                                                           <li><Link to="#" className="footer-link">Request Demo</Link></li>
                                                                           <li><Link to="#" className="footer-link">Customers</Link></li>
                                                                           <li><Link to="#" className="footer-link">Press</Link></li>
                                                            </ul>
                                             </div>
                                             <div>
                                                            <h3 className="footer-title">Terms</h3>
                                                            <ul className="footer-list">
                                                                           <li><Link to="#" className="footer-link">Terms of Service</Link></li>
                                                                           <li><Link to="#" className="footer-link">Privacy Policy</Link></li>
                                                                           <li><Link to="#" className="footer-link">Intellectual Property Policy</Link></li>
                                                            </ul>
                                             </div>
                                             <div>
                                                            <h3 className="footer-title">Contact</h3>
                                                            <ul className="footer-list">
                                                                           <li className="footer-contact"><FaFacebookF />National Road 6a Bridge No2 IDRI Building CADT, PP</li>
                                                                           <li className="footer-contact"><FaFacebookF /> (+855) 12 222 333</li>
                                                                           <li className="footer-contact"><FaFacebookF />support@jomnouy.com</li>
                                                            </ul>
                                             </div>
                              </div>
                              <div className="footer-bottom">
                                             <p>© 2025 Jomnouy. All Rights Reserved.</p>
                                             <div className="footer-social">
                                                            <Link to="#" className="social-icon"><FaFacebookF /></Link>
                                                            <Link to="#" className="social-icon"><FaFacebookF /></Link>
                                                            <Link to="#" className="social-icon"><FaFacebookF /></Link>
                                             </div>
                              </div>
               </footer>
);

export default Footers;
