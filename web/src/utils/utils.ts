import axios from "axios";
import { format } from "date-fns";
import customCss from "@/styles/bootstrapCSS.css";

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
  return `${deceasedName?.first || ""} ${deceasedName?.middle || ""} ${deceasedName?.last || ""}`;
}

export const formatMonthDayYear = date => {
  return format(date, "MMMM dd, yyyy");
};

export const formPdfHtml = (html, pageFooterLeft, pageFooterRight) => {
  const body = [
    `<!DOCTYPE html>
		<html lang="en">
		<head>		
		<meta charset="UTF-8">
		<title>Representation Grant</title>` +
      `<style>` +
      `@page {
				size: 8.5in 11in !important;
				margin: .7in 0.7in 0.9in 0.7in !important;
				font-size: 10pt !important;			
				@bottom-left {
					content:` +
      pageFooterLeft +
      `white-space: pre;
					font-size: 8pt;
					font-family: BCSans !important;
					color: #606060;
				}
				@bottom-right {
					content:` +
      pageFooterRight +
      ` " Page " counter(page) " of " counter(pages);
					font-size: 8pt;
					font-family: BCSans !important;
					color: #606060;
				}
			}` +
      `@media print{
				.new-page{
					page-break-before: always;
					position: relative; top: 8em;
				}
			}` +
      customCss +
      `@page label{font-size: 9pt;}
			.container {
				padding: 0 !important; 
				margin: 0 !important;				
				width: 100% !important;
				max-width: 680px !important;
				min-width: 680px !important;			
				font-size: 10pt !important;
				font-family: BCSans !important;
				color: #313132 !important;
			}
			` +
      `td.border-dark {height: 4.5rem;border: 1px solid #313132 !important;}` +
      `td.c1{height:2.25rem;}
			 td.c2{height:2.25rem;}		
			 td.c3{height:2.25rem;}` +
      `th.border-dark {border: 1px solid #313132 !important;}` +
      `section{ counter-increment: question-counter; text-indent: -20px; text-align: justify; text-justify: inter-word; margin: 1.0rem 0.5rem 0.5rem 0rem;}` +
      `section:before {font-weight: bolder; content:counter(question-counter) ".";}` +
      `section.resetquestion{counter-reset: question-counter;}` +
      `ol.resetcounter{list-style: none;counter-reset: bracket-counter;}` +
      `ol li.bracketnumber{text-indent: -35px;text-align: justify;text-justify: inter-word;margin:1rem 0;counter-increment: bracket-counter;}` +
      `ol li.bracketnumber:before {content:"(" counter(bracket-counter) ") ";font-weight: bold;}` +
      `ol.resetlist {list-style: none;counter-reset: list-counter;margin-left:-3.5rem;}` +
      `ol li.listnumber{counter-increment: list-counter;}` +
      `ol li.listnumber:before {content:counter(list-counter) ". ";font-weight: bold;}` +
      `ol li.bracketalpha{text-indent: -20px;margin:0.75rem 0;counter-increment: alpha;}` +
      `ol li.bracketalpha:before {content:"(" counter(alpha, lower-alpha)") ";}` +
      `
			body{				
				font-family: BCSans;
			}

			div.ch
			{
				text-align:justify; 
				text-indent:1.8rem;
				text-align-last: justify;
			}
			.ch::after{
				text-align:justify;
			}
			.checkbox::before{
				transform:translate(0px,2px);        
				height:16px;
				width:16px;
				content:url("data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjaGVjay1zcXVhcmUiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1jaGVjay1zcXVhcmUgZmEtdy0xNCIgcm9sZT0iaW1nIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00MDAgMzJINDhDMjEuNDkgMzIgMCA1My40OSAwIDgwdjM1MmMwIDI2LjUxIDIxLjQ5IDQ4IDQ4IDQ4aDM1MmMyNi41MSAwIDQ4LTIxLjQ5IDQ4LTQ4VjgwYzAtMjYuNTEtMjEuNDktNDgtNDgtNDh6bTAgNDAwSDQ4VjgwaDM1MnYzNTJ6bS0zNS44NjQtMjQxLjcyNEwxOTEuNTQ3IDM2MS40OGMtNC43MDUgNC42NjctMTIuMzAzIDQuNjM3LTE2Ljk3LS4wNjhsLTkwLjc4MS05MS41MTZjLTQuNjY3LTQuNzA1LTQuNjM3LTEyLjMwMy4wNjktMTYuOTcxbDIyLjcxOS0yMi41MzZjNC43MDUtNC42NjcgMTIuMzAzLTQuNjM3IDE2Ljk3LjA2OWw1OS43OTIgNjAuMjc3IDE0MS4zNTItMTQwLjIxNmM0LjcwNS00LjY2NyAxMi4zMDMtNC42MzcgMTYuOTcuMDY4bDIyLjUzNiAyMi43MThjNC42NjcgNC43MDYgNC42MzcgMTIuMzA0LS4wNjggMTYuOTcxeiI+PC9wYXRoPjwvc3ZnPg==");		
			}
			div.checkbox {
				display:inline-block;
				
				content:url("data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJjaGVjay1zcXVhcmUiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1jaGVjay1zcXVhcmUgZmEtdy0xNCIgcm9sZT0iaW1nIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik00MDAgMzJINDhDMjEuNDkgMzIgMCA1My40OSAwIDgwdjM1MmMwIDI2LjUxIDIxLjQ5IDQ4IDQ4IDQ4aDM1MmMyNi41MSAwIDQ4LTIxLjQ5IDQ4LTQ4VjgwYzAtMjYuNTEtMjEuNDktNDgtNDgtNDh6bTAgNDAwSDQ4VjgwaDM1MnYzNTJ6bS0zNS44NjQtMjQxLjcyNEwxOTEuNTQ3IDM2MS40OGMtNC43MDUgNC42NjctMTIuMzAzIDQuNjM3LTE2Ljk3LS4wNjhsLTkwLjc4MS05MS41MTZjLTQuNjY3LTQuNzA1LTQuNjM3LTEyLjMwMy4wNjktMTYuOTcxbDIyLjcxOS0yMi41MzZjNC43MDUtNC42NjcgMTIuMzAzLTQuNjM3IDE2Ljk3LjA2OWw1OS43OTIgNjAuMjc3IDE0MS4zNTItMTQwLjIxNmM0LjcwNS00LjY2NyAxMi4zMDMtNC42MzcgMTYuOTcuMDY4bDIyLjUzNiAyMi43MThjNC42NjcgNC43MDYgNC42MzcgMTIuMzA0LS4wNjggMTYuOTcxeiI+PC9wYXRoPjwvc3ZnPg==");
			}
			
			` +
      `</style>
		</head>
		<body>
			
				<div class="container">
					` +
      html +
      `</div></body></html>`
  ];
  return body;
}
