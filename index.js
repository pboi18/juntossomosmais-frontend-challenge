'use strict';

// JS For Search Input
const search = document.getElementById('search');
search.addEventListener('input', e => {
  const value = e.target.value;
  console.log(value);
});
// JS For API

const userCardContainer = document.querySelector('[data-user-card-container]');
const userCardTemplate = document.querySelector('[data-user-template]');

fetch('https://jsm-challenges.herokuapp.com/frontend-challenge.json')
  .then(res => res.json())
  .then(data => {
    const users = Object.values(data);
    const user = users[0];
    // console.log(user.length);

    user.forEach(element => {
      const card = userCardTemplate.content.cloneNode(true).children[0];

      const userCardImage = card.querySelector('[user-image]');
      const userCardName = card.querySelector('[user-name]');
      const userCardAdress = card.querySelector('[user-address]');
      const userCardState = card.querySelector('[user-state]');

      userCardImage.src = element.picture.medium;

      userCardName.textContent = `${element.name.title} ${element.name.first} ${element.name.last}`;

      userCardAdress.textContent = `${element.location.street}`;

      userCardState.textContent = `${element.location.state} ${element.location.city} -CEP: ${element.location.postcode}`;

      userCardContainer.append(card);
      console.log(card);
    });
  });

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
  const numberOfItems = $('.card-content .user-card').length;
  const limitPerPage = 9; //How many card items visible per a page
  const totalPages = Math.ceil(numberOfItems / limitPerPage);
  const paginationSize = totalPages; //How many page elements visible in the pagination
  let currentPage;

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
