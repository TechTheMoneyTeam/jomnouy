import React from 'react';

const Footer1 = () => {
               const currentYear = new Date().getFullYear();

               const footerLinks = {
                              about: [
                                             { name: 'About us', url: '/about-us' },
                                             { name: 'Our charter', url: '/charter' },
                                             { name: 'Stats', url: '/stats' },
                                             { name: 'Press', url: '/press' },
                                             { name: 'Jobs', url: '/jobs' }
                              ],
                              support: [
                                             { name: 'Help Center', url: '/help' },
                                             { name: 'Our Rules', url: '/rules' },
                                             { name: 'Creator Resources', url: '/resources' },
                                             { name: 'Forward Funds', url: '/funds' },
                                             { name: 'Brand assets', url: '/brand' }
                              ],
                              more: [
                                             { name: 'Newsletters', url: '/newsletters' },
                                             { name: 'Kickstarter Project Updates', url: '/updates' },
                                             { name: 'The Creative Independent', url: '/creative-independent' },
                                             { name: 'Mobile apps', url: '/apps' },
                                             { name: 'Research', url: '/research' }
                              ],
                              legal: [
                                             { name: 'Trust & Safety', url: '/trust' },
                                             { name: 'Terms of Use', url: '/terms' },
                                             { name: 'Privacy Policy', url: '/privacy' },
                                             { name: 'Cookie Policy', url: '/cookies' },
                                             { name: 'Cookie Preferences', url: '/cookie-preferences' },
                                             { name: 'Accessibility Statement', url: '/accessibility' },
                                             { name: 'CA Notice of Consent', url: '/consent' }
                              ]
               };

               const socialLinks = [
                              { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
                              { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
                              { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
                              { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com' }
               ];
               return (
                              <footer className="border-t border-gray-200 bg-white mt-10">
                                             <div className="max-w-6xl mx-auto px-4 py-10">
                                                            {/* Main footer links */}
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                                                           <div>
                                                                                          <h3 className="font-semibold text-sm uppercase mb-4">ABOUT</h3>
                                                                                          <ul className="space-y-2">
                                                                                                         {footerLinks.about.map((link, index) => (
                                                                                                                        <li key={index}>
                                                                                                                                       <a href={link.url} className="text-gray-600 hover:text-black text-sm">
                                                                                                                                                      {link.name}
                                                                                                                                       </a>
                                                                                                                        </li>
                                                                                                         ))}
                                                                                          </ul>
                                                                           </div>

                                                                           <div>
                                                                                          <h3 className="font-semibold text-sm uppercase mb-4">SUPPORT</h3>
                                                                                          <ul className="space-y-2">
                                                                                                         {footerLinks.support.map((link, index) => (
                                                                                                                        <li key={index}>
                                                                                                                                       <a href={link.url} className="text-gray-600 hover:text-black text-sm">
                                                                                                                                                      {link.name}
                                                                                                                                       </a>
                                                                                                                        </li>
                                                                                                         ))}
                                                                                          </ul>
                                                                           </div>

                                                                           <div>
                                                                                          <h3 className="font-semibold text-sm uppercase mb-4">MORE FROM JOMNOUY</h3>
                                                                                          <ul className="space-y-2">
                                                                                                         {footerLinks.more.map((link, index) => (
                                                                                                                        <li key={index}>
                                                                                                                                       <a href={link.url} className="text-gray-600 hover:text-black text-sm">
                                                                                                                                                      {link.name}
                                                                                                                                       </a>
                                                                                                                        </li>
                                                                                                         ))}
                                                                                          </ul>
                                                                           </div>
                                                            </div>
                                                            <hr className='w-full'/>

                                                            {/* Bottom footer section */}
                                                            <div className="border-none pt-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                                                                           <div className="flex items-center mb-4 md:mb-0">
                                                                                          <span className="text-black font-medium text-sm mr-2">
                                                                                                         <span className="font-bold"></span> Jomnouy, PBC © {currentYear}
                                                                                          </span>
                                                                           </div>

                                                                           <div className="flex items-center space-x-4 mb-6 md:mb-0">
                                                                                          {socialLinks.map((social, index) => (
                                                                                                         <a
                                                                                                                        key={index}
                                                                                                                        href={social.url}
                                                                                                                        className="text-gray-600 hover:text-black"
                                                                                                                        aria-label={social.name}
                                                                                                         >
                                                                                                                        {social.icon === 'facebook' && (
                                                                                                                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                                                                                                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                                                                                                       </svg>
                                                                                                                        )}

                                                                                                                        {social.icon === 'instagram' && (
                                                                                                                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                                                                                                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.181.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.977-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.671a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                                                                                                                                       </svg>
                                                                                                                        )}

                                                                                                                        {social.icon === 'twitter' && (
                                                                                                                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                                                                                                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                                                                                                                       </svg>
                                                                                                                        )}

                                                                                                                        {social.icon === 'youtube' && (
                                                                                                                                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                                                                                                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                                                                                                       </svg>
                                                                                                                        )}
                                                                                                         </a>
                                                                                          ))}
                                                                           </div>

                                                                           {/* <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                                                                                          <div className="relative">
                                                                                                         <select className="appearance-none border rounded-md py-1 pl-3 pr-8 bg-white text-sm">
                                                                                                                        <option>English</option>
                                                                                                                        <option>Español</option>
                                                                                                                        <option>Français</option>
                                                                                                         </select>
                                                                                                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                                                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                                                                                       <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                                                                        </svg>
                                                                                                         </div>
                                                                                          </div>

                                                                                          <div className="relative">
                                                                                                         <select className="appearance-none border rounded-md py-1 pl-3 pr-8 bg-white text-sm">
                                                                                                                        <option>$ US Dollar (USD)</option>
                                                                                                                        <option>€ Euro (EUR)</option>
                                                                                                                        <option>£ British Pound (GBP)</option>
                                                                                                         </select>
                                                                                                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                                                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                                                                                       <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                                                                        </svg>
                                                                                                         </div>
                                                                                          </div>
                                                                           </div> */}
                                                            </div>
                                                            <hr />

                                                            {/* Legal links */}
                                                            <div className="mt-4 border-none pt-6">
                                                                           <ul className="flex flex-wrap">
                                                                                          {footerLinks.legal.map((link, index) => (
                                                                                                         <li key={index} className="mr-6 mb-2">
                                                                                                                        <a href={link.url} className="text-gray-600 hover:text-black text-sm">
                                                                                                                                       {link.name}
                                                                                                                        </a>
                                                                                                         </li>
                                                                                          ))}
                                                                           </ul>
                                                            </div>
                                             </div>
                              </footer>
               );
};

export default Footer1;