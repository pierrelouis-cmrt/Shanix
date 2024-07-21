$(document).ready(function () {
  /* updateFontDetails() changes the HTML of each .font-details-* on document load to reflect the styles of the immediately preceding .typography-sample. This allows you to update the styles of the typography samples on the fly without having to manually enter these details into the HTML. */

  var updateFontDetails = function () {
    $(".typography-sample").each(function () {
      var thisSample = $(this);

      var getFontName = function (sample) {
        var splitFontStack = sample.css("font-family").split(",");

        var justTheName = function () {
          var rawFontName = splitFontStack[0]; //Get the first font-family from the font stack
          if ((rawFontName.charAt(0) == "'") | '"') {
            return rawFontName.substring(1, rawFontName.length - 1); //Remove the quotes from around the font-family name, if there are any
          } else {
            return rawFontName;
          }
        };

        return justTheName();
      };

      var fontName = getFontName(thisSample);
      var fontColor = thisSample.css("color");

      var fontDetails = thisSample.next("[class*=font-details-]");
      fontDetails.children(".font-name").html(fontName);
      fontDetails.children(".font-color").html(fontColor);
    });
  };

  updateFontDetails();
});

/*------------------------------*/

document.addEventListener("DOMContentLoaded", async function () {
  const elements = document.querySelectorAll('li[class^="color-"]');
  const baseUrl = "https://api.color.pizza/v1/";

  // Helper function to fetch local colors
  async function fetchLocalColor(hexCode) {
    const response = await fetch("/colors.json");
    const data = await response.json();
    const colors = data.colors;
    // Ensure hex codes are lowercase and include the '#' for matching
    hexCode = hexCode.toLowerCase();
    const color = colors.find((color) => color.hex === hexCode);
    return color ? color.name : "Unknown Color";
  }

  for (const element of elements) {
    const colorVariable = `--${element.className.split(" ")[0]}`;
    const hexCode = getComputedStyle(document.documentElement)
      .getPropertyValue(colorVariable)
      .trim()
      .toLowerCase();

    try {
      const response = await fetch(`${baseUrl}${hexCode.replace("#", "")}`);
      if (!response.ok) throw new Error("API response was not ok.");
      const data = await response.json();
      const colorName = data.colors[0].name;
      element.querySelector(
        ".color-data"
      ).textContent = `${colorName} (${hexCode})`;
    } catch (error) {
      console.error("API error or not available, using local map:", error);
      const localName = await fetchLocalColor(hexCode);
      element.querySelector(
        ".color-data"
      ).textContent = `${localName} (${hexCode})`;
    }
  }
});
