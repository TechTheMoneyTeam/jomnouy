import React, { useRef } from "react";
import FAQAccordion from "./FAQAccordion"; // Ensure this exists
import RelatedProjects from "./RelatedProjects"; // Ensure this exists

const TabContent = ({ activeTab, projects, loading, comments }) => {
               const tabRef = useRef(null);

               return (
                              <div ref={tabRef}>
                                             {activeTab === "story" && (
                                                            <div className="tab-content flex min-h-screen flex-col">
                                                                           <div className="max-w-2xl text-left"></div>
                                                                           <div className="flex flex-col items-start mt-8">
                                                                                          <p className="mb-2">
                                                                                                         Questions about this project?{" "}
                                                                                                         <a href="/faq" className="text-black-900 font-semibold underline">
                                                                                                                        Check out the FAQ
                                                                                                         </a>
                                                                                          </p>
                                                                                          <button className="report-btn">Report this project to JOMNOUY</button>
                                                                                          <hr className="hr2" />
                                                                           </div>
                                                                           <RelatedProjects projects={projects} loading={loading} />
                                                            </div>
                                             )}
                                             {activeTab === "faq" && (
                                                            <div className="tab-content">
                                                                           <FAQAccordion />
                                                                           <RelatedProjects projects={projects} loading={loading} />
                                                            </div>
                                             )}
                                             {activeTab === "comment" && (
                                                            <div className="tab-content">
                                                                           <h2 className="text-2xl font-bold">Comments</h2>
                                                                           {comments.length > 0 ? (
                                                                                          comments.map((comment, index) => (
                                                                                                         <p key={index}>
                                                                                                                        {comment.text} - <span className="text-gray-500">{comment.author}</span>
                                                                                                         </p>
                                                                                          ))
                                                                           ) : (
                                                                                          <p className="text-lg">No comments yet.</p>
                                                                           )}
                                                                           <RelatedProjects projects={projects} loading={loading} />
                                                            </div>
                                             )}
                              </div>
               );
};

export default TabContent;
