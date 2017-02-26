document.addEventListener('DOMContentLoaded',function() { 

	// DOM elements references
	var selectTitle = document.getElementById("title"),
	otherTitle = document.querySelector('#other-title'),
	colorItem = document.querySelector('#color').children,
	numOfColors = document.querySelector('#color').children.length,
	ticket = [], 
	timing = [],
	totalCost = 0,
	paymentListOptions;
	//activityNotAvailable;

	// When the page loads, give focus to the first text field & payments should be hidden: --
	$('#name').focus();
	$('.payments').children('div').hide();

	// ”Job Role” section of the form: ----

	// A text field that will be revealed when the "Other" option is selected from the "Job Role" drop down menu.
	otherTitle.style.display = 'none';
	document.querySelector('#title').onchange=showTitle;

	// Give the field an id of “other-title,” and add the placeholder text of "Your Job Role" to the field.

	function showTitle(){
		var index = this.selectedIndex;
		if(index === 5){
			otherTitle.style.display = 'block';
		}else{
			otherTitle.style.display = 'none';
		}
	}

	// ”T-Shirt Info” section of the form: -----

	// For the T-Shirt color menu, only display the color options that match the design selected in the "Design" menu.

	document.querySelector('#design').onchange=colorOptions;

	function colorOptions(){
		var index = this.selectedIndex;
		switch(index){
			// If the user selects "Theme - JS Puns" then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."
			case 1:
				colorItem[0].style.display='none';
				for(i=1; i<numOfColors; i++){ colorItem[i].style.display='block'; }
				for(i=4; i<numOfColors; i++){ colorItem[i].style.display='none'; }
				break;
			// If the user selects "Theme - I ♥ JS" then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."
			case 2:
				colorItem[0].style.display='none';
				for(i=1; i<numOfColors; i++){ colorItem[i].style.display='block'; }
				for(i=3; i>0; i--){ colorItem[i].style.display='none'; }
				break;
			// If nothing is selected Show All
			default:
				for(i=0; i<numOfColors; i++){ colorItem[i].style.display='block'; }
		}
	}

	// ”Register for Activities” section of the form: ----

	$('.activities label').find('input').not($('.activities label').eq(0)).change(checkRegisteration);

	function checkRegisteration(){
		var i,
				checked = $(this).prop('checked'),
		 		parentLabel = $(this).parents('label'),
		 		time = parentLabel.find('.time').text(),
		 		ticket = parentLabel.find('.ticket').text(),
		 		labels = $('.activities').find('label');

		var elemCost = document.createElement("h3");
		//var isOnSameTime = $(labels[i]).find('.time').text() === parentLabel.find('.time').text();
		//var isNotSelectedItem = ($(labels[i]).index() !== parentLabel.index()) ;

		var isOnSameTime = function(i) {
			return $(labels[i]).find('.time').text() === parentLabel.find('.time').text();
		};

		var isNotSelectedItem = function(i){
			return $(labels[i]).index() !== parentLabel.index();
		};

		var setCheckbox = function(setTo){
			$(labels[i]).find('input[type=checkbox]').prop('disabled', setTo);
		};

		var createCost = function(totalCost){
			var elemCost = document.createElement("h3"),
					costUnit = document.createElement("span");

				elemCost.innerHTML = "Total: $";
				costUnit.class = "total";
				costUnit.innerHTML = totalCost;
				elemCost.appendChild(costUnit); 
				document.querySelector('.activities').appendChild(elemCost);

			return costUnit; 
		};

		var updateCost = function(totalCost){
			$('.activities').find('h3').find('span').html(totalCost);
		};

		var ifMainConf = function(){
			return parentLabel.index() === 1;
		};

		if(checked){

		// Some events are at the same time as others. If the user selects a workshop, don't allow selection of a workshop at the same date and time -- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.

			for (i = 1; i <= labels.length; i++) {
				if( isOnSameTime(i) && isNotSelectedItem(i) ){ 
					setCheckbox(true);
				}
			}

			// As a user selects activities, a running total should display below the list of checkboxes. For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.

			if(parentLabel.index() === 1){
				totalCost = totalCost + 200;
			}else{
				totalCost = totalCost + 100;
			}

			if($('.activities').find('h3').length === 0){  
				createCost(totalCost);
			}else{
				updateCost(totalCost);
			}

		}else{

		// When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.

			for (i = 1; i <= labels.length; i++) {
				if( isOnSameTime(i) ){ 
					setCheckbox(false); 
				}
			}

			if(parentLabel.index() === 1){
				totalCost = totalCost - 200;
			}else{
				totalCost = totalCost - 100;
			}

			if($('.activities :checkbox:checked').length === 0){  
				$('.activities').find('h3').remove();
			}else{
				updateCost(totalCost);
			}

		}
	}

	// Payment Info section of the form: ---

	document.querySelector('#payment').onchange=paymentOptions;

	// Display payment sections based on the payment option chosen in the select menu	
	function paymentOptions(){
		var index = this.selectedIndex;
		var paypal = $('#paypal'),
				bitcoin = $('#bitcoin'),
				creditCard = $('#credit-card');

		switch(index){
			case 1:
				// The "Credit Card" payment option should be selected by default, display the #credit-card div, and hide the "Paypal" and "Bitcoin information.
				$('.payments').children('div').hide();
				creditCard.show();
				break;
			case 2:	
				// When a user selects the "PayPal" payment option, the Paypal information should display, and the credit card and “Bitcoin” information should be hidden.
				$('.payments').children('div').hide();
				paypal.show();
				break;
			case 3:
				// When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.
				$('.payments').children('div').hide();
				bitcoin.show();
				break;
			default:
				// default when nothing is selected
				$('.payments').children('div').hide();
				console.log(0);
		}
	}

	// Form validation: -----

	var form = document.querySelector('form');

	form.addEventListener('submit', function(e) {

		var e = e;

		var name = $('#name'),
				mail = $('#mail'),
				checkd = $('.activities input:checked'),
				SelectedPayment = $("#payment option:selected"); 

		//Name field can't be blank
		var invalidName = () => {
			// Provide some kind of indication when there’s a validation error. The field’s borders could turn red, for example, or a message could appear near the field or at the top of the form
			name.prev().addClass('error');
			return name.value === "";
		};

		//Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.
		var invalidEmail = () => {
			if(mail.val().indexOf("@") === -1){
				mail.prev().addClass('error'); // validation class
				return true;
			}
		};

		// Must select at least one checkbox under the "Register for Activities" section of the form.
		var invalidActivity = () => {
			if($('.activities input:checked').length === 0){
				$('.activities').find('legend').addClass('error'); // validation class
				return true;
			}
		};

		invalidActivity();

		// If the selected payment option is "Credit Card," make sure the user has supplied a credit card number, a zip code, and a 3 number CVV value before the form can be submitted.
		var invalidCreditCard = () =>{
			var cc = $('#cc-num').val();
			var zip = $('#zip').val();
			var cvv = $('#cvv').val();
			if( SelectedPayment.index()===1 && 
				  // Credit card field should only accept a number between 13 and 16 digits
					cc.length !== 0 && (cc.length > 13 || cc.length < 16) && 
					// The zipcode field should accept a 5-digit number 
				  zip.length===5 &&  
					// The CVV should only accept a number that is exactly 3 digits long 
				  cvv.length===3 ){
				return false;
			}else{
				// There should be an error indication for the name field, email field, “Register for Activities” checkboxes, credit card number, zip code, and CVV
				if(SelectedPayment.index()===1){
					if(!(cc.length !== 0 && (cc.length > 13 || cc.length < 16))){ $('#cc-num').prev().addClass('error'); }
					if(!(zip.length===5)){ $('#zip').prev().addClass('error'); }
					if(!(cvv.length===3)){ $('#cvv').prev().addClass('error'); }
				}
				return true;
			}
		};

		invalidCreditCard();

		var validation = (e) => {
			//If any of the above validation errors exist, prevent the user from submitting the form:
			if(invalidName() || invalidEmail() || invalidActivity() || invalidCreditCard()){
				e.preventDefault();
			}
		};

		validation(e);

	});

},false);