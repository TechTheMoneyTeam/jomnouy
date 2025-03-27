import { useState, useEffect } from "react";
import axios from "axios";

const useNearbyProjects = () => {
               const [projectss, setProjects] = useState([]);
               const [loadingss, setLoading] = useState(true);
               const [errors, setError] = useState(null);
               const [geoInfor, setgeoInfor] = useState({ city: "", country_name: "" });
               const [category, setCategory] = useState("All categories");
               const [type, setType] = useState("All projects type");

               useEffect(() => {
                              getUserIP();
               }, []);

               // Effect to refetch when filters change
               useEffect(() => {
                              if (geoInfor.city && geoInfor.country_name) {
                                             fetchProjectsByLocation(
                                                            geoInfor.city,
                                                            geoInfor.country_name,
                                                            category,
                                                            type
                                             );
                              }
               }, [category, type, geoInfor.city, geoInfor.country_name]);

               const getUserIP = async () => {
                              try {
                                             const response = await fetch("https://api64.ipify.org?format=json");
                                             const data = await response.json();
                                             fetchIpInfo(data.ip);
                              } catch (error) {
                                             console.error(" Failed to fetch IP address", error);
                                             setError("Failed to determine your location");
                                             setLoading(false);
                              }
               };

               const fetchIpInfo = async (ip) => {
                              try {
                                             const response = await fetch(`https://ipapi.co/${ip}/json/`);
                                             const data = await response.json();

                                             console.log(" User's Country:", data.country_name);
                                             console.log(" User's City:", data.city);

                                             if (data.city && data.country_name) {
                                                            setgeoInfor({ city: data.city, country_name: data.country_name });
                                                            fetchProjectsByLocation(
                                                                           data.city,
                                                                           data.country_name,
                                                                           category,
                                                                           type
                                                            );
                                             }
                              } catch (error) {
                                             console.error(" Failed to fetch geolocation data", error);
                                             setError("Failed to determine your location");
                                             setLoading(false);
                              }
               };

               const fetchProjectsByLocation = async (city, country, category = null, type = null) => {
                              try {
                                             setLoading(true);
                                             setError(null);
                                             console.log(`Fetching projects for: ${city}, ${country}, category: ${category}, type: ${type}`);

                                             const response = await axios.get("/api/projects/by-location", {
                                                            params: {
                                                                           city,
                                                                           country,
                                                                           category, // Directly send category
                                                                           type,     // Directly send type
                                                            },

                                                            timeout: 5000,
                                             });

                                             console.log("✅ API Response:", response.data);
                                             setProjects(response.data);
                              } catch (error) {
                                             console.error(" Failed to fetch projects by location", error);
                                             setError("Failed to load projects.");
                              } finally {
                                             setLoading(false);
                              }
               };

               return {
                              projectss,
                              loadingss,
                              errors,
                              geoInfor,
                              category,
                              setCategory,
                              type,
                              setType
               };
};

export default useNearbyProjects;