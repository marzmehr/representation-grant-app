import Vue from 'vue'
import moment from 'moment-timezone';


Vue.filter('beautify-date', function(date){
	enum MonthList {'Jan' = 1, 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'}
	if(date)
		return date.substr(8,2) + ' ' + MonthList[Number(date.substr(5,2))] + ' ' + date.substr(0,4);
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


Vue.filter('getSurveyResults', function(survey, currentStep: number, currentPage: number){
	//____________________________________________________________________
	//console.log(survey)
	// console.log(survey.currentPage.title)
	// console.log(survey.currentPage.questions)
	// console.log(survey.data)
	const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
	for(const question of survey.currentPage.questions){
		if(question.titleLocation!="hidden" && question.title != " " && question.title != "" && question.isVisible)
			if(survey.data[question.name]){
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
		else if(question.name=='PartiesHasOtherChilderen' && question.isVisible)
			questionResults.push({name:question.name, value: question.questionValue, title:question.title, inputType:question.inputType})

	}
	// console.log(result)
	// console.log(document.getElementsByName("inCourtForPO"))
	return {data: survey.data, questions:questionResults, pageName:survey.currentPage.title, currentStep: currentStep, currentPage:currentPage}
})