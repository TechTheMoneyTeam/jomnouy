const ProjectCard = ({ project }) => {
               return (
                              <Link to={`/projects/${project.project_id}`} key={project.project_id}>
                                             <Card className="rounded-lg overflow-hidden group relative mb-4 transition-shadow duration-300 hover:shadow-lg">
                                                            <img
                                                                           src={project.project_img ? `/storage/${project.project_img}` : "/api/placeholder/400/200"}
                                                                           alt={project.title}
                                                                           className="pro-image"
                                                                           onError={(e) => {
                                                                                          e.target.src = "/api/placeholder/400/200";
                                                                           }}
                                                            />
                                                            <CardContent>
                                                                           <div className="flex items-center mb-3">
                                                                                          <div className="profile-avatar">
                                                                                                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                                                         </svg>
                                                                                          </div>
                                                                                          <div className="ml-1 flex flex-col flex-grow">
                                                                                                         <h3 className="font-medium text-md">{project.title}</h3>
                                                                                                         <div className="text-gray-500 text-xs">
                                                                                                                        {project.user?.username || project.user?.name || project.user?.full_name || 'Unknown Creator'}
                                                                                                         </div>
                                                                                          </div>
                                                                                          <div className="flex justify-end">
                                                                                                         <RxBookmark />
                                                                                          </div>
                                                                           </div>
                                                                           <div className="flex items-center text-sm text-gray-500 mb-2 ml-2">
                                                                                          <div className="flex items-center mr-4">
                                                                                                         <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                                        <Clock size={16} />
                                                                                                                        <span>{getDaysSinceCreation(project.created_at)} days ago</span>
                                                                                                                        <span>•</span>
                                                                                                                        <span>{formatFunding(project.funding_goal)} Funded</span>
                                                                                                         </div>
                                                                                          </div>
                                                                           </div>
                                                                           <div className="m-2 description text-sm text-black font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                                          {project.project_des}
                                                                           </div>
                                                            </CardContent>
                                             </Card>
                              </Link>
               );
};
