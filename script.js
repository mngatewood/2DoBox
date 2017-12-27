
Card.prototype.createCard = function () {
  $('#task-container').prepend(
    `<article class="task-element" id="${this.uniqueId}">
    <h2>${this.title}</h2>
    <button type="image" src="images/delete.svg" class="delete-button"></button>
    <p class="task-description">${this.body}</p>
    <button type="image" src="images/upvote.svg" class="importance-up-button"></button>
    <button type="image" src="images/downvote.svg" class="importance-down-button"></button>
    <h3 class="importance-element">importance: </h3>
    <h3 class="importance-value">${qualityArray[this.quality]}</h3>
    <hr>
    </article>`);
}

var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical'];

function Card (title, body, uniqueId, quality) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
}

function resetInputField () {
  $('#title-input').val('');
  $('#task-input').val('');
  $('#title-input').focus();
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



function upVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'None')  {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'Low') {
    object['quality'] = 2;
    stringToStorage(object);
  } else if ($quality.text() === 'Normal') {
    object['quality'] = 3;
    stringToStorage(object);
  } else if ($quality.text() === 'High') {
    object['quality'] = 4;
    stringToStorage(object);
  }
}

function upVotePage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'None')  {
    $quality.text(qualityArray[1]);
    stringToStorage(object);
  } else if ($quality.text() === 'Low') {
    $quality.text(qualityArray[2]);
    stringToStorage(object);
  } else if ($quality.text() === 'Normal') {
    $quality.text(qualityArray[3]);
    stringToStorage(object);
  } else if ($quality.text() === 'High') {
    $quality.text(qualityArray[4]);
    stringToStorage(object);
  }
}

function downVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'Critical') {
    object['quality'] = 3;
    stringToStorage(object);
  } else if ($quality.text() === 'High') {
    object['quality'] = 2;
    stringToStorage(object);
  } else if ($quality.text() === 'Normal') {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'Low') {
    object['quality'] = 0;
    stringToStorage(object);
  }
}

function downVotePage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'Critical') {
    $quality.text(qualityArray[3]);
  } else if ($quality.text() === 'High') {
    $quality.text(qualityArray[2]);
  } else if ($quality.text() === 'Normal') {
    $quality.text(qualityArray[1]);
  } else if ($quality.text() === 'Low') {
    $quality.text(qualityArray[0]);
  }
}

$('#save-button').on('click', function(event){
  if ($('#title-input').val() == "" || $('#task-input').val() == ""){
    return false;
  } else {
    event.preventDefault();
    var newCard = new Card($('#title-input').val(), $('#task-input').val());
    newCard.createCard();
    stringToStorage(newCard);
    resetInputField();
  }
})

$('#task-container').on('click', function(event) {
  if (event.target.className === 'delete-button') {
    var ideaId = event.target.closest('.task-element').id;
    $(`#${ideaId}`).remove();
    localStorage.removeItem(ideaId);
  }
});

$('#task-container').on('click', '.importance-up-button', function(event) {
  var parsedIdea = parseFromStorage(event);
  upVoteStorage(event, parsedIdea);
  upVotePage(event, parsedIdea);
});


$('#task-container').on('click', '.importance-down-button', function(event) {
  var parsedIdea = parseFromStorage(event);
  downVoteStorage(event, parsedIdea);
  downVotePage(event, parsedIdea)
});

$('#task-container').on('click', 'h2', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedIdea = parseFromStorage(event);
    parsedIdea['title'] = $(this).html();
    stringToStorage(parsedIdea);
  });
});

$('#task-container').on('click', 'p', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedIdea = parseFromStorage(event);
    parsedIdea['body'] = $(this).html();
    stringToStorage(parsedIdea);
  });
});


$('#search-input').on('keyup', function() {
  var searchRequest = $('#search-input').val();
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf(searchRequest);
    this.style.display = searchResult > -1 ? "" : "none";
  })
})
