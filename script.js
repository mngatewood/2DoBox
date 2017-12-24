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

$('#save-button').on('click', function(event){

  if ($('.idea-title').val() == "" || $('.idea-content').val() == ""){
    return false;
  } else {
    event.preventDefault();
    var newCard = new Card($('.idea-title').val(), $('.idea-content').val());
    newCard.createCard();
    stringToStorage(newCard);
    resetInputField();
  }
})

function resetInputField () {
  $('.idea-title').val('');
  $('.idea-content').val('');
  $('.idea-title').focus();
}

function Card(title, body, uniqueId, quality) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
}

Card.prototype.createCard = function () {
  $('.idea-list').prepend(
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



$('.idea-list').on('click', function(e) {
  if (e.target.className === 'delete-button') {
    var ideaId = e.target.closest('.unique-id-style').id;
    $(`#${ideaId}`).remove();
    localStorage.removeItem(ideaId);
  }


});

var qualityArray = ['swill', 'plausible', 'genius'];


function stringToStorage(object) {
  var stringifyObject = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringifyObject);
}

function parseFromStorage(object) {
  var key = $(object.target).closest('article').attr('id');
  var retrievedIdea = localStorage.getItem(key);
  var parsedIdea = JSON.parse(retrievedIdea);
  return parsedIdea;
}


$('.idea-list').on('click', '.upvote-button', function(event) {
  
  var parsedIdea = parseFromStorage(event);
  if ($(event.target).siblings('.quality-value').text() === 'swill')  {
    $(event.target).siblings('.quality-value').text(qualityArray[1]);
    parsedIdea['quality'] = 1;
    stringToStorage(parsedIdea);
  } else if ($(event.target).siblings('.quality-value').text() === 'plausible') {
    $(event.target).siblings('.quality-value').text(qualityArray[2]);
    parsedIdea['quality'] = 2;
    stringToStorage(parsedIdea);
  }
});

$('.idea-list').on('click', '.downvote-button', function(event) {
  var parsedIdea = parseFromStorage(event);
  if ($(event.target).siblings('.quality-value').text() === 'genius') {
    $(event.target).siblings('.quality-value').text(qualityArray[1]);
    parsedIdea['quality'] = 1;
    stringToStorage(parsedIdea);
  } else if ($(event.target).siblings('.quality-value').text() === 'plausible') {
    $(event.target).siblings('.quality-value').text(qualityArray[0]);
    parsedIdea['quality'] = 0;
    stringToStorage(parsedIdea);
  }
});

$('.idea-list').on('click', 'h2', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedIdea = parseFromStorage(event);
    parsedIdea['title'] = $(this).html();
    stringToStorage(parsedIdea);
    });
  });


$('.idea-list').on('click', 'p', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedIdea = parseFromStorage(event);
    parsedIdea['body'] = $(this).html();
    stringToStorage(parsedIdea);
    });
  });


$('.search-bar').on('keyup', function() {
  var searchRequest = $('.search-bar').val();
  $('.unique-id-style').each(function(){
    var searchResult = $(this).text().indexOf(searchRequest);
    this.style.display = searchResult > -1 ? "" : "none";
  })
})
