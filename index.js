'use strict';
// JQuery For Pagination
function getPageList(totalPages, page, maxLength) {
  function range(start, end) {
    return Array.from(Array(end - start + 1), (_, i) => i + start);
  }

  var sideWidth = maxLength;
  var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
  var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

  if (totalPages <= maxLength) {
    return range(1, totalPages);
  }

  if (page <= maxLength - sideWidth - 1 - rightWidth) {
    return range(1, maxLength - sideWidth - 1).concat(
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  if (page >= totalPages - sideWidth - 1 - rightWidth) {
    return range(1, sideWidth).concat(
      0,
      range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
    );
  }

  return range(1, sideWidth).concat(
    0,
    range(page - leftWidth, page + rightWidth),
    0,
    range(totalPages - sideWidth + 1, totalPages)
  );
}

$(function () {
  var numberOfItems = $('.card-content .user-card').length;
  var limitPerPage = 9; //How many card items visible per a page
  var totalPages = Math.ceil(numberOfItems / limitPerPage);
  var paginationSize = totalPages; //How many page elements visible in the pagination
  var currentPage;

  function showPage(whichPage) {
    if (whichPage < 1 || whichPage > totalPages) return false;

    currentPage = whichPage;

    $('.card-content .user-card')
      .hide()
      .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
      .show();

    $('.page li').slice(1, -1).remove();

    getPageList(totalPages, currentPage, paginationSize).forEach(item => {
      $('<li>')
        .addClass('page-item')
        .addClass(item ? 'current-page' : 'dots')
        .toggleClass('active-page', item === currentPage)
        .append(
          $('<a>')
            .addClass('page-links')
            .attr({ href: 'javascript:void(0)' })
            .text(item || '...')
        )
        .insertBefore('.next-page');
    });

    $('.previous-page').toggleClass('disable', currentPage === 1);
    $('.next-page').toggleClass('disable', currentPage === totalPages);
    return true;
  }

  $('.page').append(
    $('<li>')
      .addClass('page-item')
      .addClass('previous-page')
      .append(
        $('<a>')
          .addClass('page-links fa-solid fa-angle-left')
          .attr({ href: 'javascript:void(0)' })
          .text('')
      ),
    $('<li>')
      .addClass('page-item')
      .addClass('next-page')
      .append(
        $('<a>')
          .addClass('page-links fa-solid fa-angle-right')
          .attr({ href: 'javascript:void(0)' })
          .text('')
      )
  );

  $('.card-content').show();
  showPage(1);

  $(document).on(
    'click',
    '.page li.current-page:not(.active-page)',
    function () {
      return showPage(+$(this).text());
    }
  );

  $('.next-page').on('click', function () {
    return showPage(currentPage + 1);
  });

  $('.previous-page').on('click', function () {
    return showPage(currentPage - 1);
  });
});

// JS For Search Input
const search = document.getElementById('search');
const cardContent = document.getElementById('user-card-container');

// JS For API

const userCardTemplate = document.querySelector('[data-user-template]');

fetch('https://jsm-challenges.herokuapp.com/frontend-challenge.json')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // data = JSON.stringify(data);
    // console.log(data);
    Object.keys(data).forEach(user => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      console.log(user);
    });
  });

// .then(data => {
//   data = JSON.parse(data);
//   console.log(data);
//   data.forEach(user => {
//     const card = userCardTemplate.content.cloneNode(true).children[0];
//     console.log(user);
//   });
// });
