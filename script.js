
Card.prototype.createCard = function () {
  $('#task-container').prepend(
    `<article class="task-element" id="${this.uniqueId}" aria-label="task" role="listitem">
    <h2 tabindex="99" aria-label="task title" style="text-decoration: ${this.textDeco}">${this.title}</h2>
    <br>
    <p class="task-description" aria-label="task description" tabindex="99" style="text-decoration: ${this.textDeco}">${this.body}</p>
    <form>
      <button type="image" src="images/upvote.svg" alt="raise importance" class="importance-up-button" tabindex="99" aria-label="raise importance"></button>
      <button type="image" src="images/downvote.svg" alt="lower importance" class="importance-down-button" tabindex="99" aria-label="lower importance"></button>
      <h3 class="importance-label">importance: </h3>
      <h3 class="importance-value" tabindex="99" aria-label="importance">${qualityArray[this.quality]}</h3>
      <label for="task-complete" aria-label="task complete"></label>
      <input type="checkbox" id="task-complete" class="task-complete" name="task-complete" tabindex="99" aria-label="task complete" ${this.complete}></input>
      <h3 class="task-complete-label">completed: </h3>
      <button type="image" src="images/delete.svg" class="delete-button" alt="delete task" tabindex="99" aria-label="delete task"></button>
    </form>
    <hr>
    </article>`);
};

var qualityArray = ['none', 'low', 'normal', 'high', 'critical'];

function Card (title, body, uniqueId, quality, complete, textDeco) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
 this.complete = complete || ' ';
 this.textDeco = textDeco;
};

function resetInputField () {
  $('#title-input').val('');
  $('#task-input').val('');
  $('#title-input').focus();
  disableSaveButton();
  disableSeeMoreButton();
};

window.onload = function() {
  persistTask((Math.max(localStorage.length - 10), 0));
  disableSaveButton();
  disableSeeMoreButton();
};

function persistTask(persistStart) {
  for (i = persistStart; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var obj = JSON.parse(getObject);
    var persistCard = new Card(obj.title, obj.body, obj.uniqueId, obj.quality, obj.complete, obj.textDeco);
    if (persistCard.complete == ' ') {    
    persistCard.createCard();
    };
  };
};

function persistCompletedTask() {
  for (i = 0; i < localStorage.length; i++) {
    var getObject = localStorage.getItem(localStorage.key(i));
    var obj = JSON.parse(getObject);
    var persistCard = new Card(obj.title, obj.body, obj.uniqueId, obj.quality, obj.complete, obj.textDeco);
    if (persistCard.complete == 'checked') {    
    persistCard.createCard();
    };
  };
};

function stringToStorage(object) {
  var stringifyObject = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringifyObject);
};

function parseFromStorage(object) {
  var key = $(object.target).closest('article').attr('id');
  var retrievedTask = localStorage.getItem(key);
  var parsedTask = JSON.parse(retrievedTask);
  return parsedTask;
};

function upVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'none')  {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'low') {
    object['quality'] = 2;
    stringToStorage(object);
  } else if ($quality.text() === 'normal') {
    object['quality'] = 3;
    stringToStorage(object);
  } else if ($quality.text() === 'high') {
    object['quality'] = 4;
    stringToStorage(object);
  };
};

function upVotePage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'none')  {
    $quality.text(qualityArray[1]);
    stringToStorage(object);
  } else if ($quality.text() === 'low') {
    $quality.text(qualityArray[2]);
    stringToStorage(object);
  } else if ($quality.text() === 'normal') {
    $quality.text(qualityArray[3]);
    stringToStorage(object);
  } else if ($quality.text() === 'high') {
    $quality.text(qualityArray[4]);
    stringToStorage(object);
  };
};

function downVoteStorage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'critical') {
    object['quality'] = 3;
    stringToStorage(object);
  } else if ($quality.text() === 'high') {
    object['quality'] = 2;
    stringToStorage(object);
  } else if ($quality.text() === 'normal') {
    object['quality'] = 1;
    stringToStorage(object);
  } else if ($quality.text() === 'low') {
    object['quality'] = 0;
    stringToStorage(object);
  };
};

function downVotePage (event, object) {
  var $quality = $(event.target).siblings('.importance-value');
  if ($quality.text() === 'critical') {
    $quality.text(qualityArray[3]);
  } else if ($quality.text() === 'high') {
    $quality.text(qualityArray[2]);
  } else if ($quality.text() === 'normal') {
    $quality.text(qualityArray[1]);
  } else if ($quality.text() === 'low') {
    $quality.text(qualityArray[0]);
  };
};

function disableSaveButton() {
  if ($('#title-input').val() === '' || $('#task-input').val() === '') {
    $('#save-button').prop('disabled', true);
  } else {
    $('#save-button').prop('disabled', false);
  };
};

function disableSeeMoreButton() {
  var tasksDisplayed = $('.task-element').length;
  if (tasksDisplayed == localStorage.length) {
    $('#show-more-button').prop('disabled', true);
  } else {
    $('#show-more-button').prop('disabled', false);
  };
};

function toggleFilterButton() {
    $(event.target).toggleClass('inactive');
};

$('#save-button').on('click', function(event){
  if ($('#title-input').val() == "" || $('#task-input').val() == ""){
    return false;
  } else {
    event.preventDefault();
    var newCard = new Card($('#title-input').val(), $('#task-input').val());
    newCard.createCard();
    stringToStorage(newCard);
    disableSaveButton();
    resetInputField();
  };
});

$('#task-container').on('click', function(event) {
  if (event.target.className === 'delete-button') {
    var taskId = event.target.closest('.task-element').id;
    $(`#${taskId}`).remove();
    localStorage.removeItem(taskId);
  };
  disableSeeMoreButton();
});

$('#task-container').on('click', '.importance-up-button', function(event) {
  event.preventDefault();
  var parsedTask = parseFromStorage(event);
  upVoteStorage(event, parsedTask);
  upVotePage(event, parsedTask);
});


$('#task-container').on('click', '.importance-down-button', function(event) {
  event.preventDefault();
  var parsedTask = parseFromStorage(event);
  downVoteStorage(event, parsedTask);
  downVotePage(event, parsedTask)
});

$('#task-container').on('click', 'h2', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedTask = parseFromStorage(event);
    parsedTask['title'] = $(this).html();
    stringToStorage(parsedTask);
  });
});

$('#task-container').on('click', 'p', function(event) {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedTask = parseFromStorage(event);
    parsedTask['body'] = $(this).html();
    stringToStorage(parsedTask);
  });
});

$('#search-input').on('keyup', function() {
  var searchRequest = $('#search-input').val().toLowerCase();
  $('.task-element').each(function(){
    var searchResult = $(this).text().toLowerCase().indexOf(searchRequest);
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#title-input').on('keyup', function () {
  disableSaveButton();
});

$('#task-input').on('keyup', function () {
  disableSaveButton();
});

$('.importance-filter-button').on('click', function(event) {
  toggleFilterButton();
});

$('#task-container').on('click', '.task-complete', function(event) {
  var parsedTask = parseFromStorage(event);
  if (this.checked) {
    parsedTask['complete'] = 'checked';
    parsedTask['textDeco'] = 'line-through';
  $(this).parent('form').siblings('h2, p').css('text-decoration', 'line-through');
    stringToStorage(parsedTask);
  } else {
    parsedTask['complete'] = ' ';
    parsedTask['textDeco'] = 'none';
    $(this).parent('form').siblings('h2, p').css('text-decoration', 'none');
    stringToStorage(parsedTask);
  };
});

$('#show-completed-tasks').on('click', function(){
  if (this.checked) {
    persistCompletedTask();
  } else {
    $('.task-element').remove();
    persistTask((Math.max((localStorage.length - 10), 0)))
  };
});

$('#show-more-button').on('click', function() {
  var tasksDisplayed = $('.task-element').length;
  $('.task-element').remove();
  var persistStart = Math.max((localStorage.length - tasksDisplayed - 10), 0);
  persistTask(persistStart);
  disableSeeMoreButton();
});

$('#filter-none').on('click', function() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('none');
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#filter-low').on('click', function() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('low');
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#filter-normal').on('click', function() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('normal');
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#filter-high').on('click', function() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('high');
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#filter-critical').on('click', function() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('critical');
    this.style.display = searchResult > -1 ? "" : "none";
  });
});

$('#main-menu').on('click', 'button', function () {
  $(this).removeClass('inactive');
  $(this).siblings('button').addClass('inactive');
});

$('#text-filter').on('click', function () {
  $('#search-container').removeClass('hidden');
  $('#importance-filter-container').addClass('hidden');
  $('#show-completed-container').addClass('hidden');
});

$('#importance-filter').on('click', function () {
  $('#search-container').addClass('hidden');
  $('#importance-filter-container').removeClass('hidden');
  $('#show-completed-container').addClass('hidden');
});

$('#completed-filter').on('click', function () {
  $('#search-container').addClass('hidden');
  $('#importance-filter-container').addClass('hidden');
  $('#show-completed-container').removeClass('hidden');
});

$('#importance-filter-container').on('click', '.importance-filter-button', function() {
  $(this).removeClass('inactive');
  $(this).siblings('.importance-filter-button').addClass('inactive');
})
