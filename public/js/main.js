
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
script.onload = function() {
  $(document).ready(function () {
    
    function fetchData() {
      const showList = $('#show');
      $.ajax({
        url: 'http://localhost:3000/loadData',
        method: 'GET',
      }).then(function (data) {
        showList.empty();
        data.forEach(function (show) {
          const listItem = display(show);
          showList.append(listItem);
        });
        showList.show();
      });
    }
    fetchData();
  
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        const searchTerm = $('#search_term').val().trim();
    
        if (searchTerm === '') {
          $('#error-message').text('Please enter a search term').show();
          return; 
        } else {
          $('#error-message').hide();
        }
    
        const searchUrl = `http://localhost:3000/search/${encodeURIComponent(searchTerm)}`;
        
        $.ajax({
          url: searchUrl,
          method: 'GET',
        }).then(function (data) {
          const showList = $('#show');
          showList.empty();
    
          data.forEach(function (result) {
            const show = result;
            const listItem = display(show);
            showList.append(listItem);
          });
    
          showList.show();
         
        });
      });
      function display(showData) {
       
       const img = $('<img>').attr('src', 'https://heymondo.com/blog/wp-content/uploads/2021/03/shutterstock_371958268_compressed.jpg');
        const title = $('<h1>').text(showData.title)
        .addClass('card-title')
      
        const dl = $('<dl>');
        const commentList = $('<div>');
        showData.comments.forEach(function (comment) {
            commentList.append($('<span>').text('userName: ' + comment.text));
        });
        dl.append($('<dt>').text('Comments: '), $('<dd>').append(commentList));

        const body = $('<p>')
        .text(showData.body)
        .addClass('card-text')

        const Comment = $(`<br> <input class="textField"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-plus" viewBox="0 0 16 16">
        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/>
        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z"/>
      </svg>`)
      

        const likes = $('<button>')
        .text(showData.likes + ' Likes')
        .addClass('btn btnCss')

        const Edit = $('<button>')
        .text('Edit')
        .addClass('btn btnCss')

        const Delete = $(`<button>`)
        .text('Delete')
        .addClass('btn btnCss')

    

        $('#show')
          .append(img,title,body,dl,likes,Edit,Delete,Comment)
          .show();
    
        
      }

      $('#show').on('click', 'a', function (event) {
        event.preventDefault();
        const showUrl = $(this).attr('href');
    
        $.ajax({
          url: showUrl,
          method: 'GET',
        }).then(function (showData) {
          displayShowDetails(showData);
        });
      });
  });
  
};
document.head.appendChild(script);

