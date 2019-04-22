
//The state object holds data from the api
let state = {
    data : '',
    selections : [],
    values : [],
};

//variables are established for future use
let resultsDiv = document.querySelector('.ContainerOfGraphLower')
let bar
let cost
let highest
let fractionalHeight
let values
let rawValue
let rawCost
let elements = document.getElementsByTagName('select')
let graphUpper = document.querySelector('.BodyBox-graph-upper')
let fadeOutBars
let fadeInBars
let barTest
let barnum
let graphLower
let initialText
let initialTextFadeIn
let CurrencyCounter
let initialTextRemove

//clears the bars and resets dropdown buttons. Adds please text back into the graph.
function clearButton() {
    fadeOut()
    for (var i = 0; i < elements.length; i++) {
        elements[i].selectedIndex = 0;
    }
    addPlease();
}

//creates a fade in effect for please text
function textFadeIn() {
    initialTextFadeIn = document.querySelector('.InitialTextFade');
    initialTextFadeIn.style.opacity = 1;
}

//adds the please div then fades in
function addPlease() {
    initialText = document.createElement('p');
    initialText.classList.add('InitialTextFade');
    initialText.textContent = 'Please Select Currencies For Display';
    graphUpper.appendChild(initialText);
    setTimeout(textFadeIn, 20);
}

//fades out and the deletes the please text
function removePlease() {
    initialTextRemove = document.querySelector('.InitialTextFade');
    if(typeof(initialTextRemove) != 'undefined' && initialTextRemove != null) {
        initialTextRemove.style.opacity = 0;
        setTimeout(clearPlease, 1000);
    }
}

//deletes the please text
function clearPlease() {
    graphUpper.innerHTML = '';
}

//deletes the bars by clearing the container of graph lower
function clearBars() {
    resultsDiv.innerHTML = ''; 
}

//shrinks and then deletes existing bars
function fadeOut() {
    barTest = document.querySelector('.BodyBox-graph-lower')
    if(typeof(barTest) != 'undefined' && barTest != null) {
        fadeOutBars = document.querySelector('.BodyBox-graph-lower');
        fadeOutBars.style.height = 0 + '%';
        setTimeout(clearBars, 500);
    }
}

//makes bars grow by transitioning height of graph lower from 0 to 100% 
function fadeIn() {
    fadeInBars = document.querySelector('.BodyBox-graph-lower');
    fadeInBars.style.height = 100 + '%';
}

//removes existing bars and recreates the graph with the new selection
function change() {
    fadeOut();
    setTimeout(render, 500);
}

//uses api data to create bars in the graph
function render() {
//clears existing data
    state.selections = [];
    state.values = [];
    resultsDiv.innerHTML = '';
//creates a list of the selected currencies
    state.selections.push(document.getElementById('selection1').value);
    state.selections.push(document.getElementById('selection2').value);
    state.selections.push(document.getElementById('selection3').value);
    state.selections.push(document.getElementById('selection4').value);
    state.selections.push(document.getElementById('selection5').value);
//creates a list currency values to find highest
    for (let selection of state.selections) {
        if (selection != 'Currency') {
            rawValue = state.data.rates[selection];
            value = rawValue.toFixed(2);
            state.values.push(value);
        }
    }
//finds highest value
    values = state.values;
    highest = Math.max(...values);
//creates a container for the bars
    graphLower = document.createElement('div');
    graphLower.classList.add('BodyBox-graph-lower');
    resultsDiv.appendChild(graphLower);
//resets variable values
    barnum = 0;
    CurrencyCounter = 0;
//if all selections are set to no selection we want to display please text
//so we count the number of no selections
    for (let selection of state.selections) {
        if (selection === 'Currency') {
            CurrencyCounter = CurrencyCounter + 1;
        }
//if there is a selection a bar is built from it
        else {
            barnum = barnum + 1;
            rawCost = state.data.rates[selection];
            cost = rawCost.toFixed(2);
            bar = document.createElement('div');
            bar.classList.add('BodyBox-graph-lower-bar');
            bar.classList.add('bar' + barnum);
            bar.textContent = selection;
//bars height is relative to the highest
            fractionalHeight = cost / highest;
            bar.style.height = fractionalHeight * 100 + '%';
            bar.innerHTML = "<p>" + selection + "</p> <p class='BodyBox-graph-lower-bar-invisibleText'> 1 USD is worth <br>" + cost + " " + selection + "</p>"
            graphLower.appendChild(bar);
        }
    }
//if all selections are set to no selection we add please text
    if (CurrencyCounter === 5) {
        addPlease();
    }
//otherwise we remove please text
    else {
        removePlease();
    }
//for fade up to work created bars must be set to fade up some miliseconds after their creation
    setTimeout(fadeIn, 20);
}

//fetch data from the api
fetch("https://api.exchangeratesapi.io/latest?base=USD")
    .then(response => response.json())
    .then(data => {
        console.log("Got the data!");
        console.log(data);
        state.data = data;
        console.log(state.data.rates.AUD)
});

addPlease()

