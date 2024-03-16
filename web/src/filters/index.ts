import Vue from 'vue'
import moment from 'moment-timezone';
import store from '@/store';
import {customCss} from './bootstrapCSS'
// import { childDetailsDataInfoType } from '@/types/Application/Children';
// import { spouseInfoType } from '@/types/Application/Spouse';
import { 
	getRelatedSpouses, 
	getRelatedChildren,
	getRelatedCreditor,
	getRelatedCreditorOrg 
} from './relatedPeople';
import { stepInfoType } from '@/types/Application';
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';

Vue.filter('get-current-version', function(){	
	//___________________________
    //___________________________
    //___________________________NEW VERSION goes here _________________
    const CURRENT_VERSION = "1.2";
    //__________________________
    //___________________________
    //___________________________
	return CURRENT_VERSION
})

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

Vue.filter('convert-time24to12', function(time) {
    const time12 = (Number(time.substr(0,2)) % 12 || 12 ) + time.substr(2,3)
    
    if (Number(time.substr(0,2))<12) {
      return time12 +' AM'
    } else {
      return time12 +' PM'
    }  
})

Vue.filter('scrollToLocation', function(locationName){
	//console.log(locationName)
	//console.log(locationName.slice(1).indexOf('_'))
	if(locationName){
		Vue.nextTick(()=>{
			let elementName = locationName
			let elementIndex = 0
			if(locationName.slice(0,1)=='_'){
				elementIndex=locationName.slice(1,locationName.slice(1).indexOf('_')+1)
				elementName =locationName.slice(locationName.slice(1).indexOf('_')+2)
				//console.log(elementName)
			}
			const el = document.getElementsByName(elementName)
			console.log(el)
			if(el[elementIndex]) el[elementIndex].scrollIntoView();
			else if(el[0]) el[0].scrollIntoView();
		})
	}
})

Vue.filter('styleTitle',function(title){
	return "<div style='display:inline; color:#29877c'>" + title + "</div>"
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

	if (nameObject && Object.keys(nameObject).length) {
		return 	(nameObject.street?(nameObject.street +", "):'') +
				(nameObject.city?(nameObject.city +", "):'') +
				(nameObject.state?(nameObject.state +", "):'') +
				(nameObject.postcode?(nameObject.postcode +", "):'') +
				(nameObject.country?(nameObject.country ):' ');
	} else{
		return " "
	}
})

Vue.filter('getFullContactInfo',function(nameObject){

    const pre = "<div style='display:inline; color:#10669c'>"
	const post = "</div>"
	if (nameObject && Object.keys(nameObject).length) {
		return pre+"Phone: "+post+
			(nameObject.phone? nameObject.phone:' - ') +
			" "+pre+"Email: "+post+
			(nameObject.email? nameObject.email:' - ') +
			" "+pre+"fax: "+post+
			(nameObject.fax? nameObject.fax:' - ');			
	} else{
		return " "
	}
})

var CadFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'CAD',
	maximumFractionDigits: 2  
	
});

Vue.filter('currencyFormat', function(cashValue){
	if (cashValue) {
		return CadFormatter.format(cashValue).replace('CA', '');
	} else {
		return '';
	}
	
})

Vue.filter('setSurveyProgress', function(survey, currentStep: number, currentPage: number, defaultProgress: number, beforeDestroy: boolean){

	let progress =  defaultProgress;
	
	if(survey && store.state.Application.steps[currentStep].pages[currentPage].progress)
		progress = survey.isCurrentPageHasErrors? 50 : 100;

	store.commit("Application/setPageProgress", { currentStep: currentStep, currentPage:currentPage, progress:progress });
	
	// const reviewProgress = store.state.Application.steps[8].pages[0].progress
	// if(currentStep < 8 && reviewProgress){
	// 	console.log('review required')
	// 	console.log(currentStep)
	// 	store.commit("Application/setPageProgress", { currentStep: 8, currentPage:0, progress:50 });
	// }
})

Vue.filter('setProgressForPages', function(currentStep: number, pageNumbers: number[], progress: number){
	for (const page of pageNumbers)
		if(store.state.Application.steps[currentStep].pages[page].progress)
			store.commit("Application/setPageProgress", { currentStep: currentStep, currentPage:page, progress:progress });
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


Vue.filter('getRelatedPeopleInfo', function(step, addCreditor, addCreditorOrg, includePrinciple, includeDescription){
	const related = [];
	related.push(...getRelatedSpouses(step, includePrinciple, includeDescription))
	related.push(...getRelatedChildren(step, includePrinciple, includeDescription))
	if(addCreditor)	related.push(...getRelatedCreditor(step, includePrinciple, includeDescription))
    if(addCreditorOrg)	related.push(...getRelatedCreditorOrg(step))
    return related;
})

Vue.filter('onlyRelationSpouse', function(steps: stepInfoType[], stPgNo: stepsAndPagesNumberInfoType){

	let onlyRelationSpouse = false;
    if(steps[stPgNo.RELATIONS._StepNo].result){
        const relationsStepResults = steps[stPgNo.RELATIONS._StepNo].result;
        const childExists = relationsStepResults.childExists == "Yes";
        const spouseExists = relationsStepResults.spouseExists == "Yes";
        let numberOfSpouse = 0;

        if(spouseExists){
            numberOfSpouse = relationsStepResults.spouseSurvey?.data?relationsStepResults.spouseSurvey.data.length:0;
        }

        const creditorPersonExists = relationsStepResults.creditorPersonExists == "Yes";
        const creditorOrgExists = relationsStepResults.creditorOrgExists == "Yes";
        
        if(!childExists && (numberOfSpouse == 1) && !creditorOrgExists && !creditorPersonExists &&
              steps[stPgNo.APPLICANT._StepNo].result){
                const applicantStepResults = steps[stPgNo.APPLICANT._StepNo].result;
                const applicantName = applicantStepResults.applicantInfoSurvey.data.applicantName;
                const spouseName = relationsStepResults.spouseSurvey.data[0].spouseName;
                onlyRelationSpouse = applicantName == spouseName;
        }

    }
    return onlyRelationSpouse;
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
				size: 8.5in 11in !important;
				margin: .7in 0.7in 0.9in 0.7in !important;
				font-size: 10pt !important;			
				@bottom-left {
					content:`+ pageFooterLeft +`;`+
					`white-space: pre;
					font-size: 7pt;
					color: #606060;
				}
				@bottom-right {
					content:`+pageFooterRight+` " Page " counter(page) " of " counter(pages);
					white-space: pre;
					font-size: 7pt;
					color: #606060;
				}
			}`+
			`@media print{
				.new-page{
					page-break-before: always;
					position: relative; top: 8em;
				}
			}`+ customCss+
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
			`+
			`td.border-dark {height: 4.5rem;border: 1px solid #313132 !important;}`+
			`td.c1{height:2.25rem;}
			 td.c2{height:2.25rem;}		
			 td.c3{height:2.25rem;}`+
			`th.border-dark {border: 1px solid #313132 !important;}`+
			`section{ counter-increment: question-counter; text-indent: -20px; text-align: justify; text-justify: inter-word; margin: 1.0rem 0.5rem 0.5rem 0rem;}`+ 
			`section:before {font-weight: bolder; content:counter(question-counter) ".";}`+
			`section.resetquestion{counter-reset: question-counter;}`+
			`ol.resetcounter{list-style: none;counter-reset: bracket-counter;}`+
			`ol li.bracketnumber{text-indent: -20px;text-align: justify;text-justify: inter-word;margin:1rem 0;counter-increment: bracket-counter;}`+
			`ol li.bracketnumber:before {content:"(" counter(bracket-counter) ") ";font-weight: bold;}`+
			`ol.resetlist {list-style: none;counter-reset: list-counter;margin-left:-3.5rem;}`+
			`ol li.listnumber{counter-increment: list-counter;}`+
			`ol li.listnumber:before {content:counter(list-counter) ". ";font-weight: bold;}`+
			`ol li.bracketalpha{text-indent: -20px;margin:0.75rem 0;counter-increment: alpha;}`+
			`ol li.bracketalpha:before {content:"(" counter(alpha, lower-alpha)") ";}`+
			`.answer{color: #000; display:inline; font-size:11pt;}`+			
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
		<body>
			
				<div class="container">
					`+html+
		`</div></body></html>`]		 
	
	return body
})