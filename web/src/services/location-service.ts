import axios from "axios";

export const LocationService = {
  getLocations: async function() {
    return await axios.get("/efiling/locations/")
  }
};
