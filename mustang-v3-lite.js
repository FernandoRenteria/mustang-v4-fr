var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;
var currentContactIndex = 0;
var allContactsLoaded = false;
var autocompleteContact = [];

// Writes to the console when the webpage is loaded
function initApplication() {
	console.log("Starting Mustang v2...");
}

// Displays the current contact in the input fields 
function viewCurrentContact() {
    currentContact = contactArray[currentContactIndex];
    document.getElementById("firstNameID").value = currentContact.firstName;
    document.getElementById("lastNameID").value = currentContact.lastName;
    document.getElementById("preferredNameID").value = currentContact.preferredName;   
    document.getElementById("emailID").value = currentContact.email;  
    document.getElementById("phoneNumberID").value = currentContact.phoneNumber;
    document.getElementById("zipID").value = currentContact.zip; 
    document.getElementById("cityID").value = currentContact.city;   
    document.getElementById("stateID").value = currentContact.state;
    document.getElementById("latID").value = currentContact.lat;
    document.getElementById("lngID").value = currentContact.lng;
    document.getElementById("favoriteHobbyID").value = currentContact.favoriteHobby;

    // Todo: Add additional fields.
    document.getElementById("statusID").innerHTML = "Status: Viewing contact " + (currentContactIndex+1) + " of " + contactArray.length;


    // Disables the previous button when the user is at contact[o]
    if(currentContactIndex == 0) {
    	document.getElementById("previousbtn").disabled = true;
    } else {
    	document.getElementById("previousbtn").disabled = false;
    }
    // Disables the next button when the user is looking at the last contact
    if(currentContactIndex == contactArray.length-1) {
    	document.getElementById("nextbtn").disabled = true;
    } else {
    	document.getElementById("nextbtn").disabled = false;
    }


}

// Gets the previous contact in the array
function previous() {
    if (currentContactIndex > 0) {
        currentContactIndex--;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();


// Gets the next contact in the array
function next() {
    if (currentContactIndex < (contactArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = contactArray[currentContactIndex];
    viewCurrentContact();
}

function add() {
    console.log('add()');
    firstName = document.getElementById("firstNameID").value;
    lastName = document.getElementById("lastNameID").value;
    preferredName = document.getElementById("preferredNameID").value;
    email = document.getElementById("emailID").value;
    phoneNumber = document.getElementById("phoneNumberID").value;
    zip = document.getElementById("zipID").value;
    city = document.getElementById("cityID").value;
    state = document.getElementById("stateID").value;
    lat = document.getElementById("latID").value;
    lng = document.getElementById("lngID").value;
    favoriteHobby = document.getElementById("favoriteHobbyID").value;

    // Todo: Implement add functionality by inserting new element into array.
    newContact = '{"firstName": "' + firstName + '", "lastName": "' + lastName +'", "preferredName": "' + preferredName 
    +'", "email": "' + email + '", "phoneNumber": "' + phoneNumber + '", "zip": "' + zip +'", "city": "' + city 
    +'", "state": "' + state + '", "lat": "' + lat + '", "lng": "' + lng + '", "favoriteHobby": "' + favoriteHobby +'"}';
    contact = JSON.parse(newContact);
    contactArray.push(contact);
    currentContactIndex = contactArray.length-1;
    viewCurrentContact();
    showSnackbar("New contact added");
    renderContact(contactArray);
}

function remove() {
    console.log('remove()');

    // Todo: Implement delete functionality by deleting element from array.
    contactArray.splice(currentContactIndex, 1);
    if(currentContactIndex > contactArray.length-1) {
    	currentContactIndex = contactArray.length-1;
    } else {
    	currentContactIndex = currentContactIndex;
    }
    document.getElementById("contactList").value = "";
    viewCurrentContact();
    showSnackbar("Contact deleted");
    renderContact(contactArray);
}


function update() {
    console.log('update()');
    firstName = document.getElementById("firstNameID").value;
    lastName = document.getElementById("lastNameID").value;
    preferredName = document.getElementById("preferredNameID").value;
    email = document.getElementById("emailID").value;
    phoneNumber = document.getElementById("phoneNumberID").value;
    zip = document.getElementById("zipID").value;
    city = document.getElementById("cityID").value;
    state = document.getElementById("stateID").value;
    lat = document.getElementById("latID").value;
    lng = document.getElementById("lngID").value;
    favoriteHobby = document.getElementById("favoriteHobbyID").value;

    updatedContact = '{"firstName": "' + firstName + '", "lastName": "' + lastName +'", "preferredName": "' + preferredName 
    +'", "email": "' + email + '", "phoneNumber": "' + phoneNumber + '", "zip": "' + zip +'", "city": "' + city 
    +'", "state": "' + state + '", "lat": "' + lat + '", "lng": "' + lng + '", "favoriteHobby": "' + favoriteHobby +'"}';
    contact = JSON.parse(updatedContact);
    contactArray[currentContactIndex] = contact;
    currentContactIndex = currentContactIndex;
    viewCurrentContact();
    showSnackbar("Contact updated");
    renderContact(contactArray);
}

// Clears the input fields 
function clearInput() {
    console.log("clearInput()");
    document.getElementById("firstNameID").value = "";
    document.getElementById("lastNameID").value = "";
    document.getElementById("preferredNameID").value = "";
    document.getElementById("emailID").value = "";
    document.getElementById("phoneNumberID").value = "";
    document.getElementById("zipID").value = "";
    document.getElementById("cityID").value = "";
    document.getElementById("stateID").value = "";
    document.getElementById("latID").value = "";
    document.getElementById("lngID").value = "";
    document.getElementById("favoriteHobbyID").value = "";
    showSnackbar("Input cleared");
}

function zipBlurFunction() {
    getPlace();
}

function getPlace() {
    var zip = document.getElementById("zipID").value;
    console.log("zip:"+zip);

    console.log("function getPlace(zip) { ... }");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = xhr.responseText;
            console.log("result:"+result);
            var place = result.split(', ');
            if (document.getElementById("cityID").value == "" || document.getElementById("cityID").value == " ") {
                document.getElementById("cityID").value = place[0];
            }
            if (document.getElementById("stateID").value == "" || document.getElementById("stateID").value == " ") {
                document.getElementById("stateID").value = place[1];
            }
        }
    }
    xhr.open("GET", "getCityState.php?zip=" + zip);
    xhr.send(null);
}


// autocomplete
function autocomplete(inp, arr) {
    var currentFocus;
    var nameClicked = false;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;

        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        // Creates a div element that will contain the autocomplete values
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "contactList");
        a.setAttribute("class", "autocomplete-items");
        // Appends it to the autocomplete container
        this.parentNode.appendChild(a);
        var arr1 = [];
        for(var i = 0; i < arr.length; i++) {
            var n = arr[i].indexOf(",");
            var name = arr[i].substr(0, n);
            arr1.push(name);
        }
        for (i = 0; i < arr.length; i++) {
            nameClicked = false;
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                // Creates a div element for the values that match the input field
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr1[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr1[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {

                    fullTag = this.getElementsByTagName("input")[0].value;
                    findAutocomplete(fullTag);

                    n = this.getElementsByTagName("input")[0].value.indexOf(",");
                    inp.value = this.getElementsByTagName("input")[0].value.substr(0,n);
                    closeAllLists();
                });
                a.appendChild(b);
            }
        } 
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "contactList");
        if (x) { x = x.getElementsByTagName("div") };
        if (e.keyCode == 40) {
            // 40 == DOWN KEY, Moves the focus down an item
            currentFocus++;
            // Calls addActive to make it more visible
            addActive(x);
        } else if (e.keyCode == 38) { //up
            // 38 == UP KEY, Moves the focus up an item
            currentFocus--;
            // Calls addActive to make it more visible
            addActive(x);
        } else if (e.keyCode == 13) {
            // 13 == ENTER KEY, Prevents the form from being submitted
            e.preventDefault();
            if (currentFocus > -1) {
                // Clicks the active item when the user presses ENTER
                if (x) { x[currentFocus].click() };
            }
        }
    });
    // Classifies an item in the autocomplete list as "active"
    function addActive(x) {
        if (!x) { return false };

        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        // Adds the CSS class that makes the item active
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    function findAutocomplete(contactName) {
        var n = contactName.indexOf(",");
        var index = 0;
        index = contactName.substr(n+1,contactName.length-1);
        index = parseInt(index);
        currentContactIndex = index;
        viewCurrentContact();
    }
}
}



function loadIndex() {
	var indexRequest = new XMLHttpRequest();
	indexRequest.open("GET", "https://mustang-index.azurewebsites.net/index.json");
	indexRequest.onload = function() {
		console.log("Index JSON file:" + indexRequest.responseText);
		contactIndex = JSON.parse(indexRequest.responseText);
		contactURLArray.length = 0;
		for(i = 0; i < contactIndex.length; i++) {
			contactURLArray.push(contactIndex[i].ContactURL);
		}
		console.log("ContactURLArray: " + JSON.stringify(contactURLArray));
		renderIndex(contactIndex);
		showSnackbar("Index loaded");
	}
	indexRequest.send();
}


function loadContacts() {
	contactArray.length = 0;
	loadingContact = 0;
	if(contactURLArray.length > loadingContact) {
		loadNextContact(contactURLArray[loadingContact]);
	} 
}


function loadNextContact(URL) {
	console.log("URL: " + URL);
	contactRequest = new XMLHttpRequest();
	contactRequest.open('GET', URL);
	contactRequest.onload = function() {
		console.log(contactRequest.responseText);
		var contact;
		contact = JSON.parse(contactRequest.responseText);
		console.log("Contact: " + contact.firstName);
		contactArray.push(contact);
		loadingContact++;
		if(contactURLArray.length > loadingContact) {
			loadNextContact(contactURLArray[loadingContact]);
		} else {
			viewCurrentContact();
            if(contactRequest.readyState == 4 & contactRequest.status == 200) {
                showSnackbar("All contacts loaded successfully");
            } else {
                showSnackbar("There was a problem with the JSON files");
            }
		}
		renderContact(contactArray);
	}
	contactRequest.send();
}

function showSnackbar(data) {
  var bar = document.getElementById("snackbar");
  bar.innerHTML = "";
  bar.innerHTML = data;
  bar.className = "show";
  setTimeout(function(){ bar.className = bar.className.replace("show", ""); }, 1500);
}


function renderIndex(indexData) {
	var indexContainer = document.getElementById("indexTable");
	indexContainer.innerHTML = "";
	var indexString = "";
	indexString = "<tr><th>Name</th><th>Email</th><th>URL</th></tr>";
	for(i = 0; i < indexData.length; i++) {
		indexString += "<tr><td>" + indexData[i].Name + "</td><td>" + indexData[i].Email + "</td><td>" + indexData[i].ContactURL + "</td></tr>";
	}
	indexContainer.insertAdjacentHTML('beforeend', indexString);
	indexContainer.style.visibility = "visible";
}

// Takes the data from the contacts and puts it into a table
function renderContact(contactData) {
	var contactContainer = document.getElementById("contactTable");
	contactContainer.innerHTML = "";
    autocompleteContact = [];
	var contactString = "";
	contactString = "<tr><th>First Name</th><th>Last Name</th><th>Preferred Name</th><th>Email</th><th>Phone Number</th><th>City</th><th>State</th>"
	+"<th>Zip</th><th>Lat</th><th>Lng</th><th>Favorite Hobby</th></tr>";
	for(i = 0; i < contactData.length; i++) {
		contactString += "<tr><td>" + contactData[i].firstName + "</td><td>" + contactData[i].lastName + "</td><td>" + contactData[i].preferredName + "</td><td>" 
		+ contactData[i].email + "</td><td>" + contactData[i].phoneNumber + "</td><td>" + contactData[i].city + "</td><td>" + contactData[i].state + "</td><td>" 
		+ contactData[i].zip + "</td><td>" + contactData[i].lat + "</td><td>" + contactData[i].lng + "</td><td>" + contactData[i].favoriteHobby + "</td></tr>";
        autocompleteContact.push(contactData[i].firstName + " " + contactData[i].lastName + "," + i);
	}
    autocomplete(document.getElementById("contactList"), autocompleteContact);
	contactContainer.insertAdjacentHTML('beforeend', contactString);
	contactContainer.style.visibility = "visible";
}

// Logs the contacts to the console
function logContacts() {
	console.log(contactArray);
	showSnackbar("Contacts logged to console");
}