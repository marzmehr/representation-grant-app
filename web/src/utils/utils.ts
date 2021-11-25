import axios from "axios";

//These are used inside of our components to convert from code and ` to a vue component.
export const convertCodeMarkupToToolTip = (str: string) => {
  return str?.replace(/<code>(.*?)<\/code>/g, (wholeMatch, m1) => {
    return `<tooltip title="${m1}"/>`;
  });
};

export const convertTicksToToolTip = (str: string) => {
  return str?.replace(/`(.*?)`/g, (wholeMatch, m1) => {
    return `<tooltip title="${m1}"/>`;
  });
};

export const getSurveyEnvironment = () => {
  const host = window.location.host;
  const DEV = ["0.0.0.0", "localhost", "dev."];
  const TEST = ["test."];
  if (DEV.some(s => host.includes(s))) {
    return "DEV";
  } else if (TEST.some(s => host.includes(s))) {
    return "TEST";
  } else {
    return "PROD";
  }
};

export const extractFilingLocations = () => {
  axios.get("/efiling/locations/").then(
    response => {
      const locationsInfo = response.data;
      const locationNames = Object.keys(response.data);
      const locations = [];

      for (const location of locationNames) {
        const locationInfo = locationsInfo[location];
        const address = locationInfo.address_1
          ? locationInfo.address_1 + ", "
          : "" + locationInfo.address_2
          ? locationInfo.address_2 + ", "
          : "" + locationInfo.address_3
          ? locationInfo.address_3 + ", "
          : "" + locationInfo.address_2
          ? locationInfo.postal
          : "";
        locations.push({ id: locationInfo.location_id, name: location, address: address });
      }
    },
    err => console.log(err)
  );
};
export const formatMailingAddress = (mailingAddress: AddressInfo) : string => {
  if (!mailingAddress) return null;
  return `${mailingAddress?.street || ""}, ${mailingAddress?.city ||
    ""}, ${mailingAddress?.state || ""}, ${mailingAddress?.country ||
    ""} ${mailingAddress?.postcode || ""}`;
};

export const formatDeceasedName = (deceasedName: PersonName) : string => {
  return `${deceasedName?.first} ${deceasedName?.middle} ${deceasedName?.last}`;
}