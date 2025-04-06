import React from 'react';
import { Helmet } from 'react-helmet'; // Import react-helmet to manage head tags dynamically
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

// ShareButton component to handle social media sharing
const ShareButton = ({ project }) => {
               // Get the current URL (in a real project, this would be the URL of your project)
               const url = window.location.href;  // This would be dynamically generated depending on your project setup
               const title = project.title;  // Project title passed as prop
               const image = project.image || "/default-image.jpg";  // Project image URL passed as prop (fallback if not provided)
               const description = project.description || "Check out this amazing project!";  // Description fallback

               return (
                              <div>
                                             {/* Set meta tags dynamically using react-helmet */}
                                             <Helmet>
                                                            <meta property="og:url" content={url} />
                                                            <meta property="og:title" content={title} />
                                                            <meta property="og:image" content={image} />
                                                            <meta property="og:description" content={description} />

                                                            <meta name="twitter:card" content="summary_large_image" />
                                                            <meta name="twitter:title" content={title} />
                                                            <meta name="twitter:description" content={description} />
                                                            <meta name="twitter:image" content={image} />
                                             </Helmet>

                                             {/* Social Media Share Buttons */}
                                             <div>
                                                            {/* Facebook Share Button */}
                                                            <FacebookShareButton
                                                                           url={url}
                                                                           quote={title}
                                                                           className="mr-4"
                                                            >
                                                                           <FacebookIcon size={32} round />
                                                            </FacebookShareButton>

                                                            {/* Twitter Share Button */}
                                                            <TwitterShareButton
                                                                           url={url}
                                                                           title={title}
                                                                           className="mr-4"
                                                            >
                                                                           <TwitterIcon size={32} round />
                                                            </TwitterShareButton>
                                             </div>
                              </div>
               );
};

export default ShareButton;
