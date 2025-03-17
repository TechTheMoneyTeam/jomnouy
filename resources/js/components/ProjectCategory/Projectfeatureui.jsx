import React from 'react';

const CrowdfundingUI = () => {
               const featuredProject = {
                              title: "Lume Cube Edge Light Go: The Task Light, Reinvented",
                              company: "Lume Cube",
                              daysLeft: 11,
                              fundingPercentage: 360,
                              description: "A portable and adjustable task light with different light modes for productivity and winding down, plus a built-in wireless charger.",
                              tags: ["Product Design", "San Diego, CA"],
                              logo: "/api/placeholder/40/40"
               };

               const recommendedProjects = [
                              {
                                             title: "Les Goulues",
                                             company: "GDBM",
                                             daysLeft: 1,
                                             fundingPercentage: 36,
                                             image: "/api/placeholder/320/200",
                                             isVerified: true
                              },
                              {
                                             title: "The Beast & Snow #1-3 - Vampire Snow White Retelling",
                                             creator: "Kat Calamia (Lifeline Comics)",
                                             daysLeft: 25,
                                             fundingPercentage: 116,
                                             image: "/api/placeholder/320/200",
                                             isVerified: true
                              },
                              {
                                             title: "PRIVATE DANCE Season One Hardcover",
                                             company: "Cheeky Comics",
                                             daysLeft: 12,
                                             fundingPercentage: 573,
                                             image: "/api/placeholder/320/170",
                                             isVerified: true
                              },
                              {
                                             title: "Rainbow Canvas: Valentine's Annual 2024",
                                             creator: "Phil Falco (Lifeline Comics)",
                                             daysLeft: 4,
                                             fundingPercentage: 103,
                                             image: "/api/placeholder/320/170",
                                             isVerified: true
                              }
               ];

               return (
                              <div className="bg-gray-50 min-h-screen p-4 md:p-8">
                                             <div className="max-w-7xl mx-auto">
                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                                           {/* Featured Project Section */}
                                                                           <div>
                                                                                          <h2 className="text-lg font-medium text-gray-600 mb-4">FEATURED PROJECT</h2>
                                                                                          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                                                                                                         <div className="grid grid-cols-4 h-80">
                                                                                                                        {[1, 2, 3, 4].map((index) => (
                                                                                                                                       <div key={index} className="relative overflow-hidden">
                                                                                                                                                      <img
                                                                                                                                                                     src={`/api/placeholder/200/320`}
                                                                                                                                                                     alt={`Project image ${index}`}
                                                                                                                                                                     className="h-full w-full object-cover"
                                                                                                                                                      />
                                                                                                                                                      {index === 1 && (
                                                                                                                                                                     <div className="absolute top-4 left-4">
                                                                                                                                                                                    <img src={featuredProject.logo} alt="Company logo" className="rounded-full" />
                                                                                                                                                                     </div>
                                                                                                                                                      )}
                                                                                                                                       </div>
                                                                                                                        ))}
                                                                                                         </div>
                                                                                                         <div className="p-4">
                                                                                                                        <div className="flex items-center mb-4">
                                                                                                                                       <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                                                                                                                                                      <img src={featuredProject.logo} alt="Company logo" className="h-full w-full object-cover" />
                                                                                                                                       </div>
                                                                                                                                       <div className="flex-1">
                                                                                                                                                      <div className="flex items-center">
                                                                                                                                                                     <h3 className="text-xl font-bold mr-2">{featuredProject.title}</h3>
                                                                                                                                                                     <div className="flex items-center bg-green-100 text-green-800 rounded-full p-1 text-xs mr-2">
                                                                                                                                                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current mr-1">
                                                                                                                                                                                                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                                                                                                                                                    </svg>
                                                                                                                                                                     </div>
                                                                                                                                                                     <button className="text-gray-500">
                                                                                                                                                                                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                                                                                                                                                                                   <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                                                                                                                                                                    </svg>
                                                                                                                                                                     </button>
                                                                                                                                                      </div>
                                                                                                                                                      <p className="text-gray-600">{featuredProject.company}</p>
                                                                                                                                       </div>
                                                                                                                        </div>
                                                                                                                        <div className="flex items-center mb-4">
                                                                                                                                       <div className="flex items-center text-gray-600 mr-4">
                                                                                                                                                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-1">
                                                                                                                                                                     <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                                                                                                                      </svg>
                                                                                                                                                      <span>{featuredProject.daysLeft} days left</span>
                                                                                                                                       </div>
                                                                                                                                       <div className="text-gray-600">• {featuredProject.fundingPercentage}% funded</div>
                                                                                                                        </div>
                                                                                                                        <p className="text-gray-800 mb-4">{featuredProject.description}</p>
                                                                                                                        <div className="flex flex-wrap gap-2">
                                                                                                                                       {featuredProject.tags.map((tag, index) => (
                                                                                                                                                      <span key={index} className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm">
                                                                                                                                                                     {tag}
                                                                                                                                                      </span>
                                                                                                                                       ))}
                                                                                                                        </div>
                                                                                                         </div>
                                                                                          </div>
                                                                           </div>

                                                                           {/* Recommended Projects Section */}
                                                                           <div>
                                                                                          <h2 className="text-lg font-medium text-gray-600 mb-4">RECOMMENDED FOR YOU</h2>
                                                                                          <div className="grid grid-cols-1 gap-4">
                                                                                                         {recommendedProjects.map((project, index) => (
                                                                                                                        <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${index > 1 ? "h-48" : "h-64"}`}>
                                                                                                                                       <div className="flex">
                                                                                                                                                      <div className={`${index <= 1 ? "w-full" : "w-1/3"} relative`}>
                                                                                                                                                                     <img
                                                                                                                                                                                    src={project.image}
                                                                                                                                                                                    alt={project.title}
                                                                                                                                                                                    className="h-full w-full object-cover"
                                                                                                                                                                     />
                                                                                                                                                                     {index === 0 && (
                                                                                                                                                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 flex items-end p-4">
                                                                                                                                                                                                   <div className="bg-white rounded px-2 py-1 text-xs font-medium">Castelexa</div>
                                                                                                                                                                                                   <div className="bg-green-500 rounded px-2 py-1 text-xs font-medium text-white ml-2">36%</div>
                                                                                                                                                                                                   <div className="bg-white rounded px-2 py-1 text-xs font-medium ml-auto">KICKSTARTER</div>
                                                                                                                                                                                    </div>
                                                                                                                                                                     )}
                                                                                                                                                      </div>
                                                                                                                                                      <div className={`${index <= 1 ? "hidden" : "flex-1 p-4"}`}>
                                                                                                                                                                     <div className="flex justify-between mb-2">
                                                                                                                                                                                    <h3 className="font-bold text-lg truncate mr-2">{project.title}</h3>
                                                                                                                                                                                    <button className="text-gray-500">
                                                                                                                                                                                                   <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                                                                                                                                                                                                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                                                                                                                                                                                   </svg>
                                                                                                                                                                                    </button>
                                                                                                                                                                     </div>
                                                                                                                                                                     <p className="text-gray-600 mb-2">{project.company || project.creator}</p>
                                                                                                                                                                     <div className="flex items-center">
                                                                                                                                                                                    <div className="flex items-center text-gray-600 mr-4">
                                                                                                                                                                                                   <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-1">
                                                                                                                                                                                                                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                                                                                                                                                                   </svg>
                                                                                                                                                                                                   <span>{project.daysLeft} {project.daysLeft === 1 ? 'day' : 'days'} left</span>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="text-gray-600">• {project.fundingPercentage}% funded</div>
                                                                                                                                                                     </div>
                                                                                                                                                      </div>
                                                                                                                                       </div>
                                                                                                                                       {index <= 1 && (
                                                                                                                                                      <div className="p-4">
                                                                                                                                                                     <div className="flex items-center mb-1">
                                                                                                                                                                                    <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                                                                                                                                                                                                   <img src="/api/placeholder/40/40" alt="Creator avatar" className="h-full w-full object-cover" />
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="flex-1">
                                                                                                                                                                                                   <div className="flex items-center justify-between">
                                                                                                                                                                                                                  <h3 className="font-bold text-lg">{project.title}</h3>
                                                                                                                                                                                                                  <button className="text-gray-500">
                                                                                                                                                                                                                                 <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                                                                                                                                                                                                                                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                                                                                                                                                                                                                 </svg>
                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                   </div>
                                                                                                                                                                                                   <p className="text-gray-600">{project.company || project.creator}</p>
                                                                                                                                                                                    </div>
                                                                                                                                                                     </div>
                                                                                                                                                                     <div className="flex items-center">
                                                                                                                                                                                    <div className="flex items-center text-gray-600 mr-4">
                                                                                                                                                                                                   <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current mr-1">
                                                                                                                                                                                                                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                                                                                                                                                                                   </svg>
                                                                                                                                                                                                   <span>{project.daysLeft} {project.daysLeft === 1 ? 'day' : 'days'} left</span>
                                                                                                                                                                                    </div>
                                                                                                                                                                                    <div className="text-gray-600">• {project.fundingPercentage}% funded</div>
                                                                                                                                                                     </div>
                                                                                                                                                      </div>
                                                                                                                                       )}
                                                                                                                        </div>
                                                                                                         ))}
                                                                                          </div>
                                                                           </div>
                                                            </div>

                                                            {/* Pagination */}
                                                            <div className="flex justify-center mt-8">
                                                                           <div className="flex items-center space-x-2">
                                                                                          <button className="p-2 text-gray-400">
                                                                                                         <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                                                                                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                                                                                         </svg>
                                                                                          </button>
                                                                                          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-medium">1</button>
                                                                                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 font-medium">2</button>
                                                                                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 font-medium">3</button>
                                                                                          <button className="p-2 text-gray-700">
                                                                                                         <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                                                                                                        <path d="M10.59 7.41L12 6l6 6-6 6-1.41-1.41L15.17 12z" />
                                                                                                         </svg>
                                                                                          </button>
                                                                           </div>
                                                            </div>
                                             </div>
                              </div>
               );
};

export default CrowdfundingUI;