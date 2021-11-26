import Vue from "vue";

Vue.filter("scrollToLocation", function(locationName) {
  if (locationName) {
    Vue.nextTick(() => {
      let elementName = locationName;
      let elementIndex = 0;
      if (locationName.slice(0, 1) == "_") {
        elementIndex = locationName.slice(1, locationName.slice(1).indexOf("_") + 1);
        elementName = locationName.slice(locationName.slice(1).indexOf("_") + 2);
      }
      const el = document.getElementsByName(elementName);
      if (el[elementIndex]) el[elementIndex].scrollIntoView();
      else if (el[0]) el[0].scrollIntoView();
    });
  }
});

var CadFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 2
});

Vue.filter("currencyFormat", function(cashValue) {
  if (cashValue) {
    return CadFormatter.format(cashValue).replace("CA", "");
  } else {
    return "";
  }
});
