
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
script.onload = function() {
  $(document).ready(function () {

    function isLoggedIn(){
      const alreadyLoggedIn = localStorage.getItem("userInfo");
      if(alreadyLoggedIn){
        const sidebar = $('#sidebar');
        const newsFeed = $('<a>')
        .attr('href', '/newsFeed')
        .text('News Feed')
        .addClass('list-group-item list-group-item-action')
       
        const addpost = $('<a>')
        .attr('href', '/addpost')
        .text('Add Post')
        .addClass('list-group-item list-group-item-action')

        const profile = $('<a>')
        .attr('href', '/profile')
        .text('My Profile')
        .addClass('list-group-item list-group-item-action')

        const logout = $('<a>')
        .attr('href', '/logout')
        .text('Logout')
        .addClass('list-group-item list-group-item-action')
        .click(function (event) {
          event.preventDefault();
          localStorage.removeItem("userInfo");
          location.href = 'http://localhost:3000/'
        })
        sidebar.append(newsFeed,addpost,profile,logout);
        return true;
      }
      return false;
    }
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
   
    if(isLoggedIn()){
      fetchData();
    }else{
      $('#searchForm').hide();
      $('#logout').hide();
      $('#addpost').hide();
      $('#profile').hide();
      const msg = $('<h1>')
      .text('Unauthorized Access')
      .addClass('card-text')

      const link = $('<a>')
        .attr('href', '/')
        .text('Back To Login')
        .addClass('card-text')
      $('#unAuthorized').append(msg,link).show();
    }
  
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        const searchTerm = $('#search_term').val().trim();
        console.log(event)
        if (searchTerm === '') {
          $('#search-error').text('Please enter a search term').show();
          return; 
        } else {
          $('#search-error').hide();
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
       
        const user_name = $('<h1>').text(showData.userName)
        .addClass('')
       const img = $('<img>').
       attr('src', 'https://heymondo.com/blog/wp-content/uploads/2021/03/shutterstock_371958268_compressed.jpg');
        const title = $('<h1>').text(showData.title)
        .addClass('card-title')
      
        const dl = $('<dl>');
        const commentList = $('<div>');
        showData.comments.forEach(function (comment) {
            commentList.append($('<span>').text(comment.userName ? comment.userName: '' + ' : ' + comment.text));
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
        .attr('id','myBtn')
        .attr('type','submit')
        .addClass('btn btnCss')
        .click(function (event) {
          event.preventDefault()
          $('#show')
          .hide();

          $('#searchForm')
          .hide();

          const heading = $('<h1>').text('Edit post')
          .addClass('')
          $('#modal').append(heading).show()
          const title = $('<input>').val(showData.title)
          .addClass('textField')
          .attr('id','editTitle')
          $('#modal').append(title).show()
          const body = $('<input>').val(showData.body)
          .addClass('textField')
          .attr('id','editBody')
          $('#modal').append(body).show()

          const btn = $('<button>').text('Continue')
          .addClass('btn btnCss')
          .click(function(event){
            event.preventDefault();
            const editUrl = `http://localhost:3000/edit`;
            const titleVal = document.getElementById('editTitle').value;
            const bodyVal = document.getElementById('editBody').value
            let data ={
              userId:showData.userId,
              userName:showData.userName,
              postId:showData._id,
              title:titleVal,
              body:bodyVal,
            }
        
            $.ajax({
                url: editUrl,
                method: 'PUT',
                contentType: 'application/json', 
                data: JSON.stringify(data)
              }).then(function (showData) {
                location.href ='http://localhost:3000/newsFeed'
                
              })
          })
          $('#modal').append(btn).show()

          const cancel = $('<button>').text('Cancel')
          .addClass('btn btnCss')
          .click(function (event) {
            event.preventDefault();
           location.href ='http://localhost:3000/newsFeed'
          })
          $('#modal').append(cancel).show()
          
        })

        const Delete = $(`<button>`)
        .text('Delete')
        .attr('id','delete')
        .addClass('btn btnCss')
        .click(function (event) {
            event.preventDefault();
            const deleteUrl = `http://localhost:3000/delete/${encodeURIComponent(showData._id)}`;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
              }).then(function (showData) {
                fetchData();
              })
              
          });
    

        $('#show')
          .append(user_name,img,title,body,dl,likes,Edit,Delete,Comment)
          .show();
    
        
      }

      $('#post-form').submit(function (event) {
        event.preventDefault();
        const title = $('#title').val().trim();
        const body = $('#body').val().trim();
        const titleInput = /^[A-Za-z0-9#?.!]+$/.test(title)
        const bodyInput = /^[A-Za-z0-9#?.!]+$/.test(body)
        if (title === '') {
          $('#error-message')
          .text('Invalid: Must enter title text')
          .addClass('error')
          .show();
          $('#errorBody').hide()
          return; 
        } else if(body ===''){
            $('#errorBody')
            .text('Invalid: Must enter body text')
            .addClass('error')
            .show();
            $('#error-message').hide()
            return; 
        }
        // else if(!titleInput){
        //     $('#error-message')
        //   .text('Invalid: Special characters not allowed')
        //   .addClass('error')
        //   .show();
        // }else if(!bodyInput){
        //     $('#errorBody')
        //   .text('Invalid: Special characters not allowed')
        //   .addClass('error')
        //   .show();
        // }
        else {
          $('#error-message').hide();
          $('#errorBody').hide();
        const url = `http://localhost:3000/addNewPost`;
        let data = {
            userId: '64d2f47e11d02df99ad95595',
            userName: 'anne34',
            body:body,
            title:title
          
        }
        $.ajax({
          url: url,
          method: 'POST',
          contentType: 'application/json', 
          data: JSON.stringify(data)
        }).then(function (data) {
          location.href='http://localhost:3000/newsFeed'
        });
        
      }
      });

      $('#searchFriends').submit(function (event) {
        event.preventDefault();
        const userName = $('#search_term').val().trim();
    
        if (userName === '') {
          $('#error-message').text('Please enter a search term').show();
          return; 
        } else {
          $('#error-message').hide();
        }
    
        const searchUrl = `http://localhost:3000/addfriends`;
        let body ={
          userName:userName,
          userId:'64d2f36a11d02df99ad95594'
        }
        $.ajax({
          url: searchUrl,
          method: 'POST',
          contentType: 'application/json', 
          data: JSON.stringify(body)
        }).then(function (data) {
          const friendList = $('#friendList');
          friendList.empty();
    
          data.forEach(function (result) {
            const show = result;
            const listItem = createTemplate(show);
            friendList.append(listItem);
          });
    
          friendList.show();
         
        });
      });
      function createTemplate(data){
        const list = $('friends')
        const user_name = $('<h1>').text(data.userName)
        .addClass('')

        list.append(user_name)
      }

      $('#registration').submit(function (event) {
        event.preventDefault();
        const firstname = $('#firstname').val().trim();
        const lastname = $('#lastname').val().trim();
        const email = $('#email').val().trim();
        const phoneNumber = $('#phoneNumber').val().trim();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        if (username === '') {
          $('#username-error').text('Please enter username').show();
          return; 
        } else if (password === '') {
          $('#password-error').text('Please enter password').show();
          return; 
        } else {
          $('#password-error').hide();
          $('#username-error').hide();
        }
      
        const searchUrl = `http://localhost:3000/register`;
        const data ={
          firstName : firstname,
         lastName : lastname,
          email:email,
          phoneNumber:phoneNumber,
          userName:username,
          password:password
        }
        $.ajax({
          url: searchUrl,
          method: 'POST',
          contentType: 'application/json', 
          data:JSON.stringify(data)
        }).then(function (data) {
          $('#login-error').hide();
          const message = $('<h1>').text('Registration Successful')
          .addClass('')

          const goBack = $('<a>')
          .text('Back To Login')
          .attr('href', '/')
          .addClass('')

          $('#registration').append(message,goBack).show()
         
        })
        .catch(e =>{
          $('#error').text(e.responseJSON.error).show();
        })
      })
  });

  
};
document.head.appendChild(script);


const login = ()=>{
  const username = $('#username').val().trim();
  const password = $('#password').val().trim();
  if (username === '') {
    $('#username-error').text('Please enter username').show();
    return; 
  } else if (password === '') {
    $('#password-error').text('Please enter password').show();
    return; 
  } else {
    $('#password-error').hide();
    $('#username-error').hide();
  }

  const searchUrl = `http://localhost:3000/login`;
  const data ={
    userName:username,
    password:password
  }
  $.ajax({
    url: searchUrl,
    method: 'POST',
    contentType: 'application/json', 
    data:JSON.stringify(data)
  }).then(function (data) {
    $('#login-error').hide();
    localStorage.setItem("userInfo", username);
    location.href ='http://localhost:3000/newsFeed'
   
  })
  .catch(e =>{
    $('#login-error').text(e.responseJSON.error).show();
  })
  
}




