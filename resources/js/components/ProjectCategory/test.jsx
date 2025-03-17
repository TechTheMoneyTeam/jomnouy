// src/components/GetLocation.js
import { UserX } from "lucide-react";
import React, { useEffect, useState } from "react";

const GetLocation = () => {
               const [ipAddress, setIpAddress] = useState('');
               const [geoInfor, setGeoInfor] = useState({});

               useEffect(() => {
                              getUserIP();
               }, []);

               const getUserIP = async () => {
                              try {
                                          
                                             const response = await fetch('https://api.ipify.org?format=json');
                                             const data = await response.json();
                                             setIpAddress(data.ip);
                                             // Call fetchIpInfo after the IP address is set
                                             fetchIpInfo(data.ip);
                              } catch (error) {
                                             console.error("Failed to fetch IP address", error);
                              }
               };

               const fetchIpInfo = async (ip) => {
                              try {
                                             const response = await fetch(`https://ipapi.co/${ip}/json/`);
                                             const data = await response.json();
                                             setGeoInfor(data);
                              } catch (error) {
                                             console.error("Failed to fetch geolocation data", error);
                              }
               };

               if (!ipAddress || !geoInfor.city) {
                              return <div>Loading...</div>;
               }

               return (
                              <div>
                                             <h1>User Location</h1>
                                             <p>IP: {ipAddress}</p>
                                             {/* Display the geographical info if available */}
                                             {geoInfor && (
                                                            <>
                                                                           <p>Country: {geoInfor.country_name}</p>
                                                                           <p>City: {geoInfor.city}</p>
                                                            </>
                                             )}
                              </div>
               );
};

export default GetLocation;
