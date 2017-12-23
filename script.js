var $saveButton = $('#save-button');
var $ideaList = $('.idea-list');
var $ideaTitle = $('.idea-title');
var $ideaContent = $('.idea-content');

window.onload = function() {
  persistIdea();
}

function persistIdea() {
  for(i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var parseObject = JSON.parse(getObject);
    var persistCard = new Card(parseObject.title, parseObject.body, parseObject.uniqueId, parseObject.quality);
    persistCard.createCard();
  }
}

$saveButton.on('click', function(event){

  if ($ideaTitle.val() == "" || $ideaContent.val() == ""){
    return false;
  } else {
    event.preventDefault();
  var newCard = new Card($ideaTitle.val(), $ideaContent.val());
  newCard.createCard();
  addToStorage(newCard);
  $('.idea-title').val('');
  $('.idea-content').val('');
  }
})

function Card(title, body, uniqueId, quality) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
}

Card.prototype.createCard = function () {
  $ideaList.prepend(
    `<article class="unique-id-style" id="${this.uniqueId}">
    <h2>${this.title}</h2>
    <img class="delete-button">
    <p class="idea-details">${this.body}</p>
    <img class="upvote-button">
    <img class="downvote-button">
    <h3 class="idea-quality">quality:</h3>
    <h3 class="quality-value">${qualityArray[this.quality]}</h3>
    <hr>
    </article>`);
}


function addToStorage(object) {
  var stringifyObj = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringifyObj);
}

$ideaList.on('click', function(e) {
  if (e.target.className === 'delete-button') {
    var ideaId = e.target.closest('.unique-id-style').id;
    $(`#${ideaId}`).remove();
    localStorage.removeItem(ideaId);
  }


});

var qualityArray = ['swill', 'plausible', 'genius'];

$ideaList.on('click', function(e) {
  if (e.target.className === 'upvote-button') {
    if ($(e.target).siblings('.quality-value').text() === 'swill')  {
      $(e.target).siblings('.quality-value').text(qualityArray[1]);
    } else if ($(e.target).siblings('.quality-value').text() === 'plausible') {
      $(e.target).siblings('.quality-value').text(qualityArray[2])
    }
  }
});

$ideaList.on('click', '.downvote-button', function(e) {
  var key = $(this).closest('article').attr('id')
  var retrievedIdea = localStorage.getItem(key);
  var parsedIdea = JSON.parse(retrievedIdea);
  if ($(e.target).siblings('.quality-value').text() === 'genius') {
    $(e.target).siblings('.quality-value').text(qualityArray[1]);
    parsedIdea['quality'] = 1;
    var stringifiedObject = JSON.stringify(parsedIdea);
    localStorage.setItem(key, stringifiedObject);
  } else if ($(e.target).siblings('.quality-value').text() === 'plausible') {
    $(e.target).siblings('.quality-value').text(qualityArray[0]);
    parsedIdea['quality'] = 0;
    var stringifiedObject = JSON.stringify(parsedIdea);
    localStorage.setItem(key, stringifiedObject);
  }
});


var $searchResults = $('.unique-id-style p');
$('.search-bar').keyup(function(){
  var results = $.trim($(this).val()).replace('').toLowerCase();
  console.log('hi');
})




// function upvoteButton(e) {

//     console.log(this.target);
//   // e.target.siblings('')

// }

// function downvoteButton(e) {

// }


  //When a user clicks the title or body of an idea in the list, that text should become an editable text field, pre-populated with the existing idea title or body.
  //The user should be able to “commit” their changes by pressing “Enter/Return” or by clicking outside of the text field.
  //If the user reloads the page, their edits will be reflected.
  // content editable 
  // event listener (keyup)



  //As a user types in the search box, the list of ideas should filter in real time to only display ideas whose title or body include the user’s text. The page should not reload.
  //Clearing the search box should restore all the ideas to the list.

    // var cardId = $(e.target).closest('cardname').getProp('id')

    // $(`#${cardId} quality-value`)




