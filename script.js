
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

function Card (title, body, uniqueId, quality) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
}

function resetInputField () {
  $('.idea-title').val('');
  $('.idea-content').val('');
  $('.idea-title').focus();
}

window.onload = function() {
  persistIdea();
}

function persistIdea() {
  for(i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var obj = JSON.parse(getObject);
    var persistCard = new Card(obj.title, obj.body, obj.uniqueId, obj.quality);
    persistCard.createCard();
  }
}

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

var qualityArray = ['swill', 'plausible', 'genius'];

function upVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.quality-value')
  if ($quality.text() === 'swill')  {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'plausible') {
    object['quality'] = 2;
    stringToStorage(object);
  }
}

function upVotePage (event, object) {
  var $quality = $(event.target).siblings('.quality-value')
  if ($quality.text() === 'swill')  {
    $quality.text(qualityArray[1]);
  } else if ($quality.text() === 'plausible') {
    $quality.text(qualityArray[2]);
    stringToStorage(object);
  }
}

function downVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.quality-value')
  if ($quality.text() === 'genius') {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'plausible') {
    object['quality'] = 0;
    stringToStorage(object);
  }
}

function downVotePage (event, object) {
  var $quality = $(event.target).siblings('.quality-value')
  if ($quality.text() === 'genius') {
    $quality.text(qualityArray[1]);
  } else if ($quality.text() === 'plausible') {
    $quality.text(qualityArray[0]);
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

$('.idea-list').on('click', function(event) {
  if (event.target.className === 'delete-button') {
    var ideaId = event.target.closest('.unique-id-style').id;
    $(`#${ideaId}`).remove();
    localStorage.removeItem(ideaId);
  }
});

$('.idea-list').on('click', '.upvote-button', function(event) {
  var parsedIdea = parseFromStorage(event);
  upVoteStorage(event, parsedIdea);
  upVotePage(event, parsedIdea);
});


$('.idea-list').on('click', '.downvote-button', function(event) {
  var parsedIdea = parseFromStorage(event);
  downVoteStorage(event, parsedIdea);
  downVotePage(event, parsedIdea)
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
