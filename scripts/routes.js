function scope(model, value) {
  var elements = document.querySelectorAll('[data-bind=\" + model + \"]');
  for (var i = 0; i < elements.length; i++) { elements[i].textContent = value; }
}

window.addEventListener('routechange', function() {
  scope('location.pathname', location.pathname);
  scope('route.params', JSON.stringify(route.params));
});

function Book() {
  scope('name', 'Book');
  scope('params.bookId', route.params.bookId);
}

function Chapter() {
  scope('name', 'Chapter');
  scope('params.bookId', route.params.bookId);
  scope('params.chapterId', route.params.chapterId);
}

route
  .when('/Book/:bookId', {
    templateUrl: 'book.html',
    handler: Book,
  })
  .when('/Book/:bookId/ch/:chapterId', {
    templateUrl: 'chapter.html',
    handler: Chapter
  });
