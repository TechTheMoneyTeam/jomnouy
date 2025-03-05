import React, { useState } from 'react';
import { BiSolidLike } from "react-icons/bi";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import './comment.css';

const CommentSection = () => {
               const initialComments = [
                              {
                                             id: 1,
                                             username: 'Buttsquirter',
                                             avatar: '/api/placeholder/50/50',
                                             timeAgo: '16 days ago',
                                             content: 'Ssbm needs this, please as buff Jesus himself get this in Genesis for this is a new beginning',
                                             hasEmojis: true,
                                             likes: 25,
                                             liked: false,
                                             replies: []
                              },
                              {
                                             id: 2,
                                             username: 'Lord fartamor',
                                             avatar: '/api/placeholder/50/50',
                                             timeAgo: '18 days ago',
                                             content: 'hi🙏',
                                             likes: 23,
                                             liked: false,
                                             replies: []
                              },
                              {
                                             id: 3,
                                             username: 'Travis Beauchamp',
                                             avatar: '/api/placeholder/50/50',
                                             timeAgo: '16 days ago',
                                             content: 'Lord Fartamor! My liege.',
                                             isCreator: true,
                                             hasLeftBorder: true,
                                             likes: 10,
                                             liked: false,
                                             replies: []
                              },
               ];

               const [commentData, setCommentData] = useState(initialComments);
               const [newComment, setNewComment] = useState('');

               const handleLikeClick = (id) => {
                              setCommentData(prevComments =>
                                             prevComments.map((comment) =>
                                                            comment.id === id
                                                                           ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
                                                                           : comment
                                             )
                              );
               };

               const handleAddComment = () => {
                              if (newComment.trim()) {
                                             const newCommentObj = {
                                                            id: commentData.length + 1,
                                                            username: 'New User', // Replace with actual username logic
                                                            avatar: '/api/placeholder/50/50',
                                                            timeAgo: 'Just now',
                                                            content: newComment,
                                                            likes: 0,
                                                            liked: false,
                                                            replies: []
                                             };
                                             setCommentData(prevComments => [newCommentObj, ...prevComments]);
                                             setNewComment(''); // Clear the input field
                              }
               };

               const handleAddReply = (commentId, replyText) => {
                              setCommentData(prevComments =>
                                             prevComments.map(comment =>
                                                            comment.id === commentId
                                                                           ? {
                                                                                          ...comment,
                                                                                          replies: [
                                                                                                         ...comment.replies,
                                                                                                         {
                                                                                                                        id: comment.replies.length + 1,
                                                                                                                        username: 'New User', // Replace with actual username logic
                                                                                                                        timeAgo: 'Just now',
                                                                                                                        content: replyText,
                                                                                                                        likes: 0,
                                                                                                                        liked: false
                                                                                                         }
                                                                                          ]
                                                                           }
                                                                           : comment
                                             )
                              );
               };

               return (
                              <div className='max-w-3xl mx-auto mt-8'>
                                             <div className="w-full bg-[#C0C0C0]/[0.10] p-4 flex items-center justify-between rounded-lg">
                                                            <div className="flex items-center flex-1">
                                                                           <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                                                                          <FaUserCircle size={32} className="text-gray-500" />
                                                                           </div>
                                                                           <div className="flex-1 relative p-4">
                                                                                          <input
                                                                                                         type="text"
                                                                                                         placeholder="Add a comment ...."
                                                                                                         className="w-full bg-transparent text-black pl-3 py-2 outline-none text-sm rounded-lg border border-gray-300 focus:border-red-500"
                                                                                                         value={newComment}
                                                                                                         onChange={(e) => setNewComment(e.target.value)}
                                                                                          />
                                                                           </div>
                                                            </div>
                                                            <div className="flex items-center">
                                                                           <button
                                                                                          onClick={handleAddComment}
                                                                                          className={`px-8 py-2 rounded-full ${newComment.length > 0
                                                                                                         ? 'bg-[#F07900] text-white hover:bg-gray-600'
                                                                                                         : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                                                                         }`}
                                                                                          disabled={newComment.length === 0}
                                                                           >
                                                                                          Send
                                                                           </button>
                                                            </div>
                                             </div>
                                             <hr className='mt-4 mb-4' />
                                             <div className="bg-white-500 p-8 rounded-sm mt-4">
                                                            {commentData.map((comment) => (
                                                                           <Comment
                                                                                          key={comment.id}
                                                                                          comment={comment}
                                                                                          onLikeClick={handleLikeClick}
                                                                                          onAddReply={handleAddReply}
                                                                           />
                                                            ))}
                                             </div>
                              </div>
               );
};

const Comment = ({ comment, onLikeClick, onAddReply }) => {
               const [replyVisible, setReplyVisible] = useState(false);
               const [reply, setReply] = useState('');

               const handleReplyToggle = () => {
                              setReplyVisible(prev => !prev);
               };

               const handleReplySubmit = () => {
                              if (reply.trim()) {
                                             onAddReply(comment.id, reply);
                                             setReply('');
                                             setReplyVisible(false);
                              }
               };

               return (
                              <div className="mb-4 p-4 border border-[#C0C0C0]/[0.80] rounded-sm">
                                             <div className="flex items-start">
                                                            <div className="profile-avatar">
                                                                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                                                                           </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                           <div className="flex items-center">
                                                                                          <span className="font-medium text-sm">{comment.username}</span>
                                                                           </div>
                                                                           <div className="text-gray-500 text-xs font-medium mb-2">{comment.timeAgo}</div>
                                                                           <div className="text-gray-800 text-sm font-medium">{comment.content}</div>
                                                                           <div className='mt-8'>
                                                                                          {replyVisible && (
                                                                                                         <motion.div
                                                                                                                        initial={{ opacity: 0, height: 0 }}
                                                                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                                                                        exit={{ opacity: 0, height: 0 }}
                                                                                                                        transition={{ duration: 0.3 }}
                                                                                                                        className="mt-2 overflow-hidden"
                                                                                                         >
                                                                                                                        <div className="flex items-start space-x-2 mb-2">
                                                                                                                                       <FaUserCircle size={32} className="text-gray-500" />
                                                                                                                                       <div className="flex-1">
                                                                                                                                                      <input
                                                                                                                                                                     type="text"
                                                                                                                                                                     placeholder="Add a reply..."
                                                                                                                                                                     className="w-full bg-transparent border-[#C0C0C0] text-black/80 focus:ring-0 rounded-md"
                                                                                                                                                                     value={reply}
                                                                                                                                                                     onChange={(e) => setReply(e.target.value)}
                                                                                                                                                      />
                                                                                                                                       </div>
                                                                                                                        </div>
                                                                                                                        <div className="flex justify-end mt-2 space-x-4">
                                                                                                                                       <button
                                                                                                                                                      onClick={() => setReplyVisible(false)}
                                                                                                                                                      className="bg-none text-black/70 text-sm font-semibold rounded-full py-2"
                                                                                                                                       >
                                                                                                                                                      Cancel
                                                                                                                                       </button>
                                                                                                                                       {reply && (
                                                                                                                                                      <motion.button
                                                                                                                                                                     initial={{ opacity: 0, scale: 0.8 }}
                                                                                                                                                                     animate={{ opacity: 1, scale: 0.8 }}
                                                                                                                                                                     exit={{ opacity: 0, scale: 0.8 }}
                                                                                                                                                                     transition={{ duration: 0.3 }}
                                                                                                                                                                     onClick={handleReplySubmit}
                                                                                                                                                                     className="bg-[#F07900] text-white text-sm font-semibold rounded-full px-6 py-2"
                                                                                                                                                      >
                                                                                                                                                                     Reply
                                                                                                                                                      </motion.button>
                                                                                                                                       )}
                                                                                                                        </div>
                                                                                                         </motion.div>
                                                                                          )}
                                                                           </div>
                                                                                          {/* Nested Replies */}
                                                                                          {comment.replies && comment.replies.length > 0 && (
                                                                                                         <div className="ml-10 mt-4">
                                                                                                                        {comment.replies.map((reply) => (
                                                                                                                                       <div key={reply.id} className="mb-2 p-2 bg-gray-50 rounded-sm">
                                                                                                                                                      <div className="flex items-center">
                                                                                                                                                                     <span className="font-medium text-sm mr-2">{reply.username}</span>
                                                                                                                                                                     <span className="text-gray-500 text-xs">{reply.timeAgo}</span>
                                                                                                                                                      </div>
                                                                                                                                                      <div className="text-gray-800 text-sm">{reply.content}</div>
                                                                                                                                       </div>
                                                                                                                        ))}
                                                                                                         </div>
                                                                                          )}
                                                                           <div className="flex items-center justify-end space-x-2 mt-4">
                                                                                          <button
                                                                                                         className="flex items-center px-2 py-1 rounded transition-colors duration-200 hover:text-[#F07900]/[0.50]"
                                                                                                         onClick={() => onLikeClick(comment.id)}
                                                                                          >
                                                                                                         <BiSolidLike size={16} color={comment.liked ? '#F07900' : '#C0C0C0'} />
                                                                                                         <span className={`font-medium text-sm pl-1 ${comment.liked ? 'text-[#F07900]' : 'text-[#C0C0C0]'}`}>
                                                                                                                        {comment.likes}
                                                                                                         </span>
                                                                                          </button>
                                                                                          <button
                                                                                                         className="flex items-center text-black opacity-80 text-sm hover:text-[#F07900] font-semibold"
                                                                                                         onClick={handleReplyToggle}
                                                                                          >
                                                                                                         Reply
                                                                                          </button>
                                                                           </div>
                                                            </div>
                                             </div>
                              </div>
               );
};

export default CommentSection;