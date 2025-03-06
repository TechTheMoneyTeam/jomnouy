import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
const FAQAccordion = () => {
               const [openItem, setOpenItem] = useState("How do I place an order?");
               const faqItems = [
                              {
                                             question: "How do I place an order?",
                                             answer: "To place an order, navigate to our website or mobile app, select your preferred restaurant, choose your desired items, and proceed to checkout. You'll receive a confirmation once your order is placed."
                              },
                              {
                                             question: "Can I schedule orders in advance?",
                                             answer: "Yes, you can schedule orders in advance. During checkout, select the 'Schedule for Later' option and choose your preferred date and time for delivery."
                              },
                              {
                                             question: "What are your delivery hours?",
                                             answer: "Our delivery hours vary by location. Most restaurants offer delivery from 11:00 AM to 10:00 PM, but specific hours can be found on each restaurant's page."
                              },
                              {
                                             question: "How long does delivery take?",
                                             answer: "Delivery typically takes 30-45 minutes depending on your distance from the restaurant, order volume, and weather conditions."
                              },
                              {
                                             question: "Is there a delivery fee?",
                                             answer: "Yes, delivery fees vary based on your distance from the restaurant and may be waived for orders above a certain amount. The exact fee will be displayed at checkout."
                              },
                              {
                                             question: "What payment methods do you accept?",
                                             answer: "We accept all major credit cards, debit cards, digital wallets (Apple Pay, Google Pay), and in some locations, cash on delivery."
                              },
                              {
                                             question: "How do I create an account?",
                                             answer: "To create an account, click on the 'Sign Up' button on our website or app. You'll need to provide your email, create a password, and enter basic delivery information."
                              }
               ];

               const toggleItem = (question) => {
                              setOpenItem(openItem === question ? null : question);
               };
               return (
                              <div className="max-w-3xl mx-auto p-6">
                                             <h1 className="text-2xl font-medium mb-8">Frequently Asked Questions</h1>

                                             <div className="space-y-2">
                                                            {faqItems.map((item) => (
                                                                           <div
                                                                                          key={item.question}
                                                                                          className="border border-gray-200 rounded"
                                                                           >
                                                                                          <button
                                                                                                         className="w-full px-6 py-4 text-left flex justify-between items-center"
                                                                                                         onClick={() => toggleItem(item.question)}
                                                                                          >
                                                                                                         <span className="font-medium">{item.question}</span>
                                                                                                         <ChevronRight
                                                                                                                        className={`transition-transform duration-200 ${openItem === item.question ? 'transform rotate-90' : ''
                                                                                                                                       }`}
                                                                                                         />
                                                                                          </button>

                                                                                          {openItem === item.question && (
                                                                                                         <div className="px-6 pb-4 text-gray-600">
                                                                                                                        {item.answer}
                                                                                                         </div>
                                                                                          )}
                                                                           </div>
                                                            ))}
                                             </div>
                              </div>
               );
};

export default FAQAccordion;