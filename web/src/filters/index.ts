import Vue from 'vue'
import moment from 'moment-timezone';
import store from '@/store';
import {customCss} from './bootstrapCSS'

Vue.filter('beautify-date', function(date){
	enum MonthList {'Jan' = 1, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}
	if(date)
		return date.substr(8,2) + ' ' + MonthList[Number(date.substr(5,2))] + ' ' + date.substr(0,4);
	else
		return ''
})

Vue.filter('beautify-full-date', function(date){
	enum MonthList {'January' = 1, 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'}
	if(date)
		return MonthList[Number(date.substr(5,2))] + ' ' + date.substr(8,2) + ', ' + date.substr(0,4);
	else
		return ''
})

Vue.filter('beautify-date-weekday', function(date){
	if(date)
		return	moment(date).format('ddd MMM DD, YYYY HH:mm');
	else
		return ''
})

Vue.filter('scrollToLocation', function(locationName){
	console.log(locationName)
	//console.log(locationName.substring(0,3))
	if(locationName){
		Vue.nextTick(()=>{
			const el = document.getElementsByName(locationName)
			console.log(el)
			if(el[0]) el[0].scrollIntoView();
		})
	}
})

Vue.filter('getFullName',function(nameObject){
	if (nameObject) {
		return nameObject.first +
			" " +
			nameObject.middle +
			" " +
			nameObject.last;
	} else{
		return " "
	}
})

Vue.filter('getFullAddress',function(nameObject){
	if (nameObject) {
		return nameObject.street +
			", " +
			nameObject.city +
			", " +
			nameObject.state+
			", " +
			nameObject.country+
			", " +
			nameObject.postcode;
	} else{
		return " "
	}
})

Vue.filter('getFullContactInfo',function(nameObject){
	if (nameObject) {
		return "Phone: " +
			nameObject.phone +
			", Email: " +
			nameObject.email +
			", Fax: " +
			nameObject.fax;
	} else{
		return " "
	}
})

Vue.filter('setSurveyProgress', function(survey, currentStep: number, currentPage: number, defaultProgress: number, beforeDestroy: boolean){

	let progress =  defaultProgress;
	
	if(survey && store.state.Application.steps[currentStep].pages[currentPage].progress)
		progress = survey.isCurrentPageHasErrors? 50 : 100;
	//console.log(store.state.Application.steps[currentStep].pages[currentPage].progress)
	store.commit("Application/setPageProgress", { currentStep: currentStep, currentPage:currentPage, progress:progress });
	
	const reviewProgress = store.state.Application.steps[8].pages[0].progress
	if(currentStep < 8 && reviewProgress){
		console.log('review required')
		console.log(currentStep)
		store.commit("Application/setPageProgress", { currentStep: 8, currentPage:0, progress:50 });
	}
})


Vue.filter('getSurveyResults', function(survey, currentStep: number, currentPage: number){
	//____________________________________________________________________
	//console.log(survey)if(question.titleLocation!="hidden" && question.title != " " && question.title != "" && question.isVisible)
	// console.log(survey.currentPage.title)
	// console.log(survey.currentPage.questions)
	// console.log(survey.data)
	const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
	for(const question of survey.currentPage.questions){
		if(question.isVisible && question.questionValue!=true && question.questionValue!=false)
			if(question.name=='bankAccountInfoPanel'){
				console.log("____________")
				console.log(question)
				console.log(question.name)
				console.log(question.inputType)
				console.log(question.questionValue);
				for(const panel of question.panels)
				{
					
					console.log("_____PANEL______")
					console.log(panel)
					console.log(panel.questions)
					console.log(panel.name)
					console.log(panel.inputType)
					console.log(panel.questionsValue);
					for(const panelquestion of panel.questions){
						console.log("____________")
						console.log(panelquestion)
						console.log(panelquestion.name)
						console.log(panelquestion.inputType)
						console.log(panelquestion.questionValue);
						if(panelquestion.isVisible && panelquestion.questionValue!=true && panelquestion.questionValue!=false)
						questionResults.push({name:panelquestion.name, value: panelquestion.questionValue, title:panelquestion.fullTitle, inputType:panelquestion.inputType})
					}
				}
			}
			else if(survey.data[question.name]){
				// console.log("____________")
				// console.log(question)
				// console.log(question.name)
				// console.log(question.inputType)
				// console.log(question.questionValue);
				// if(Array.isArray(question.questionValue))
				//     console.log(question.questionValue.join());
				// else
				//     console.log(question.questionValue);
				// console.log(question.title)

				questionResults.push({name:question.name, value: question.questionValue, title:question.title, inputType:question.inputType})
			} else if(question.isRequired ){
				// console.error("____________")
				// console.log(question)
				// console.log(question.name)
				// console.log(question.inputType)
				// console.log(question.questionValue);
				questionResults.push({name:question.name, value: "", title:question.title, inputType:question.inputType})	
			}
		//__specialities
		
	}
	// console.log(result)
	// console.log(document.getElementsByName("inCourtForPO"))
	return {data: survey.data, questions:questionResults, pageName:survey.currentPage.title, currentStep: currentStep, currentPage:currentPage}
})


Vue.filter('extractRequiredDocuments', function(questions){
	//console.log(questions)
	const requiredDocuments = [];
	//		requiredDocuments.push("Copy of the existing written agreements or court order(s) about the child(ren) concerning parenting arrangements, child support, contact with a child or guardianship of a child");
	// 	}transform: scale(0.6);transform-origin: 0 0;				
	// }size: 15.5in 16.17in;margin: 3rem 3rem 4rem 3rem;	
	//console.log(requiredDocuments)<link rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" >

	return requiredDocuments;
})

Vue.filter('printPdf', function(html, pageFooterLeft, pageFooterRight){

	//console.log(customCss)
	const body = [
		`<!DOCTYPE html>
		<html lang="en">
		<head>		
		<meta charset="UTF-8">
		<title>Representation Grant</title>`+
		`<style>`+
			`@page {
				size: 8.5in 11in;
				margin: 3rem 3rem 4rem 3rem;				
				@bottom-left {
					content:`+ pageFooterLeft +
					`white-space: pre;
					font-size: 6pt;
				}
				@bottom-right {
					content:`+pageFooterRight+` " Page " counter(page) " of " counter(pages);
					font-size: 8pt;
				}
			}`+
			`@media print{
				.new-page{
					page-break-before: always;
					position: relative; top: 8em;
				}
			}`+ customCss+
			`td.border-dark {height: 4.5rem;border: 1px solid black;}`+
			`td.c1{width: 37.5rem;}
			 td.c2{width: 11rem;}		
			 td.c3{width: 11rem;}`+
			`th.border-dark {border: 1px solid black;}`+
			`section{ counter-increment: question-counter; text-indent: -20px; text-align: justify; text-justify: inter-word; margin: 1.0rem 0.5rem 0.5rem 0rem;}`+ 
			`section:before {font-weight: bolder; content:counter(question-counter) ".";}`+
			`section.resetquestion{counter-reset: question-counter;}`+
			`ol.resetcounter{list-style: none;counter-reset: bracket-counter;}`+
			`ol li.bracketnumber{text-indent: -35px;text-align: justify;text-justify: inter-word;margin:1rem 0;counter-increment: bracket-counter;}`+
			`ol li.bracketnumber:before {content:"(" counter(bracket-counter) ") ";font-weight: bold;}`+
			`ol.resetlist {list-style: none;counter-reset: list-counter;margin-left:-3.5rem;}`+
			`ol li.listnumber{counter-increment: list-counter;}`+
			`ol li.listnumber:before {content:counter(list-counter) ". ";font-weight: bold;}`+
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
			`+
		`</style>
		</head>
		<body>`+html+
		`</body>\n</html>`]		 
	//console.log(body)		
	return body
})