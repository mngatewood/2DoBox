window.onload = function() {
  persistTask(Math.max(localStorage.length - 10, 0));
  disableSaveButton();
  disableSeeMoreButton();
};

Card.prototype.createCard = function() {
  var qualityArray = ['none', 'low', 'normal', 'high', 'critical'];
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

function Card(title, body, uniqueId, quality, complete, textDeco) {
 this.title = title;
 this.uniqueId = uniqueId || $.now();
 this.body = body;
 this.quality = quality || 0;
 this.complete = complete || ' ';
 this.textDeco = textDeco;
};

function checkComplete() {
  if(this.complete = 'checked') {
    this.style.display = 'none';
  }
}

function deleteButton(event) {
  event.preventDefault();
  var taskId = event.target.closest('.task-element').id;
  $(`#${taskId}`).remove();
  localStorage.removeItem(taskId);
  disableSeeMoreButton();
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

function downVotePage(event, object) {
  var qualityArray = ['none', 'low', 'normal', 'high', 'critical'];
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

function downVoteStorage(event, object) {
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

function editDescription() {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedTask = parseFromStorage(event);
    parsedTask['body'] = $(this).html();
    stringToStorage(parsedTask);
  });
};

function editTitle() {
  $(this).prop('contenteditable', true).focus();
  $(this).focusout( function() {
    var parsedTask = parseFromStorage(event);
    parsedTask['title'] = $(this).html();
    stringToStorage(parsedTask);
  });
};

function filterByText() {
  var searchRequest = $('#search-input').val().toLowerCase();
  $('.task-element').each(function(){
    var searchResult = $(this).text().toLowerCase().indexOf(searchRequest);
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function filterCritical() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('critical');
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function filterHigh() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('high');
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function filterLow() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('low');
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function filterNone() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('none');
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function filterNormal() {
  $('.task-element').each(function(){
    var searchResult = $(this).text().indexOf('normal');
    this.style.display = searchResult > -1 ? '' : 'none';
  });
};

function importanceDown(event) {
  event.preventDefault();
  var parsedTask = parseFromStorage(event);
  downVoteStorage(event, parsedTask);
  downVotePage(event, parsedTask)
};

function importanceUp(event) {
  event.preventDefault();
  var parsedTask = parseFromStorage(event);
  upVoteStorage(event, parsedTask);
  upVotePage(event, parsedTask);
};

function parseFromStorage(object) {
  var key = $(object.target).closest('article').attr('id');
  var retrievedTask = localStorage.getItem(key);
  var parsedTask = JSON.parse(retrievedTask);
  return parsedTask;
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

function removeCompleted() {
  $('.task-element').each(checkComplete);
};

function resetInputField() {
  $('#title-input').val('');
  $('#task-input').val('');
  $('#title-input').focus();
  disableSaveButton();
  disableSeeMoreButton();
};

function saveButton(event) {
  if ($('#title-input').val() == '' || $('#task-input').val() == ''){
    return false;
  } else {
    event.preventDefault();
    var newCard = new Card($('#title-input').val(), $('#task-input').val());
    newCard.createCard();
    stringToStorage(newCard);
    disableSaveButton();
    resetInputField();
  };
};

function showCompleted(){
  removeCompleted();
  if (this.checked) {
    persistCompletedTask();
  } else {
    $('.task-element').remove();
    persistTask(Math.max(localStorage.length - 10, 0))
  };
};

function showCompletedFilter() {
  $('#search-container').addClass('hidden');
  $('#importance-filter-container').addClass('hidden');
  $('#show-completed-container').removeClass('hidden');
};

function showImportanceFilter() {
  $('#search-container').addClass('hidden');
  $('#importance-filter-container').removeClass('hidden');
  $('#show-completed-container').addClass('hidden');
};

function showMore() {
  var tasksDisplayed = $('.task-element').length;
  $('.task-element').remove();
  var persistStart = Math.max(localStorage.length - tasksDisplayed - 10, 0);
  persistTask(persistStart);
  disableSeeMoreButton();
};

function showTextFilter() {
  $('#search-container').removeClass('hidden');
  $('#importance-filter-container').addClass('hidden');
  $('#show-completed-container').addClass('hidden');
};

function stringToStorage(object) {
  var stringifyObject = JSON.stringify(object);
  localStorage.setItem(object.uniqueId, stringifyObject);
};

function taskComplete() {
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
};

function toggleActive() {
  $(this).removeClass('inactive');
  $(this).siblings('button, input').addClass('inactive');
};

function toggleFilterButton() {
    $(event.target).toggleClass('inactive');
};

function upVotePage(event, object) {
  var qualityArray = ['none', 'low', 'normal', 'high', 'critical'];
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

function upVoteStorage(event, object) {
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

$('#completed-filter').on('click', showCompletedFilter);

$('#filter-critical').on('click', filterCritical);

$('#filter-high').on('click', filterHigh);

$('#filter-low').on('click', filterLow);

$('#filter-none').on('click', filterNone);

$('#filter-normal').on('click', filterNormal);

$('#importance-filter').on('click', showImportanceFilter)

$('.importance-filter-button').on('click', toggleFilterButton);

$('#importance-filter-container').on('click', 'input', toggleActive);

$('#main-menu').on('click', 'button', toggleActive);

$('#save-button').on('click', saveButton);

$('#search-input').on('keyup', filterByText);

$('#show-completed-tasks').on('click', showCompleted);

$('#show-more-button').on('click', showMore);

$('#task-container').on('click', '.delete-button', deleteButton);

$('#task-container').on('click', '.importance-down-button', importanceDown);

$('#task-container').on('click', '.importance-up-button', importanceUp);

$('#task-container').on('click', '.task-complete', taskComplete);

$('#task-container').on('click', 'h2', editTitle);

$('#task-container').on('click', 'p', editDescription);

$('#text-filter').on('click', showTextFilter);

$('#title-input, #task-input').on('keyup', disableSaveButton);

