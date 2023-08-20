
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
script.onload = function() {
  $(document).ready(function () {
    function loadFriend(){
      let url = 'http://localhost:3000/userInfo'
      const user = JSON.parse(localStorage.getItem('userInfo'))
      let data ={
        userId:user.userid
      }
      $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json', 
        data: JSON.stringify(data)
      }).then(function (showData) {
        const fr = $('#list');
        $('#list').empty();
        showData.friends.forEach(p=>{
          const friend = $('<li>')
          .text(p)
          .addClass('')
          fr.append(friend).show();
        })
        
      })
      .catch(e=>{
        
      })
    }
    function isLoggedIn(){
      const alreadyLoggedIn = JSON.parse(localStorage.getItem("userInfo"));
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

        const addFriend = $('<a>')
        .attr('href', '/addFriend')
        .text('Add Friends')
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
        sidebar.append(newsFeed,addpost,profile,addFriend,logout);

        const userName = $('#userName');
        const name = $('<span>')
        .text(alreadyLoggedIn.username)
        userName.append(name)
        if(location.pathname =='/profile'){
          let url = 'http://localhost:3000/userInfo'
          const user = JSON.parse(localStorage.getItem('userInfo'))
          let data ={
            userId:user.userid
          }
          $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify(data)
          }).then(function (showData) {
            const profile = $('#profile');

            const firstName = $('<p>')
            .addClass('card-text')
            .text('Full Name: ' + showData.firstName + ' '+showData.lastName)

            const userName = $('<p>')
            .addClass('card-text')
            .text('User Name: ' + showData.userName)

            const email = $('<p>')
            .addClass('card-text')
            .text('Email: ' +  showData.email)

            const phone = $('<p>')
            .addClass('card-text')
            .text('Phone Number: ' +  showData.phoneNumber)


            profile.append(firstName,userName,email,phone).show();
            
          })
          .catch(e=>{
            
          })
        }
        if(location.pathname =='/'){
          location.href ='http://localhost:3000/newsFeed'
        }
        if(location.pathname =='/register'){
          location.href ='http://localhost:3000/newsFeed'
        }
        if(location.pathname =='/logout'){
          location.href ='http://localhost:3000/newsFeed'
        }
        if(location.pathname =='/addFriend'){
          loadFriend()
        }
        return true;
      }
      if((location.pathname =='/newsFeed' 
      || location.pathname =='/profile'
      ||location.pathname =='/addFriend'
      ||location.pathname =='/addpost'
       || location.pathname =='/logout'))
      {
        location.href ='http://localhost:3000/'
       
      }
      return false;
    }
    function fetchData() {
      
      const showList = $('#show');
      $('#loading').show() 
      $.ajax({
        url: 'http://localhost:3000/loadData',
        method: 'GET',
      }).then(function (data) {
        showList.empty();
        $('#loading').hide() 
        data.forEach(function (show) {
          const listItem = display(show);
          showList.append(listItem);
        });
        showList.show();
      })
      .catch(e=>{
        $('#loading').show()
      })
    }
   
    if(isLoggedIn()){
      fetchData();
    }else{
      $('#searchForm').hide();
      $('#logout').hide();
      $('#addpost').hide();
      $('#profile').hide();
      
    }
  
    $('#searchForm').submit(function (event) {
        event.preventDefault();
        const searchTerm = $('#search_term').val().trim();
        if (searchTerm === '' || !userNameValidate(searchTerm)) {
          $('#search-error').text('Please enter a valid search term').show();
          return; 
        } else {
          $('#search-error').hide();
        }
    
        const searchUrl = `http://localhost:3000/search/${encodeURIComponent(searchTerm)}`;
        $('#noDatafound').empty();
        $.ajax({
          url: searchUrl,
          method: 'GET',
        }).then(function (data) {
          const showList = $('#show');
          showList.empty();
          if(data && data.length > 0){
            data.forEach(function (result) {
              const show = result;
              const listItem = display(show);
              showList.append(listItem);
            });
            showList.show();
            
          }else{
            const noDatafound = $('#noDatafound');
            const data = $('<span>').text('No result found')
        .addClass('')
        noDatafound.append(data).show();
          }
         
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
          commentList.append($('<p>').text(comment.userName + ': ' +comment.text));
                });
        dl.append($('<dt>').text('Comments: '), $('<dd>').append(commentList));

        const body = $('<p>')
        .text(showData.body)
        .addClass('card-text')

    
        const  Comment = $('<button>')
        .text('Write Comment')
        .attr('id','myBtn')
        .attr('type','submit')
        .addClass('btn btnCss')
        .click(function (event) {
          event.preventDefault()
          $('#show')
          .hide();

          $('#searchForm')
          .hide();

          const heading = $('<h1>').text('Add Comment')
          .addClass('')
          $('#comment').append(heading).show()
          const text = $('<input>')
          .addClass('textField')
          .attr('id','addText')
          $('#comment').append(text).show()
   

          const btn = $('<button>').text('Continue')
          .addClass('btn btnCss')
          .click(function(event){
            event.preventDefault();
            const url = `http://localhost:3000/comment`;
          
            const text = $('#addText').val().trim();
            if(text ==''){
              $('#error').empty();
              const error = $('<br><span>').text('Please enter text')
             .addClass('error')
             $('#comment').append(error).show()
          return;
            }
            const userinfo = JSON.parse(localStorage.getItem('userInfo'))
            let data ={
              userId:userinfo.userid,
              userName:userinfo.username,
              postId:showData._id,
              text:text,
            
            }
            $('#loading').show() 
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json', 
                data: JSON.stringify(data)
              }).then(function (showData) {
               console.log('loading')
                $('#loading').hide() 
                location.href ='http://localhost:3000/newsFeed'
                
              })
              .catch(e=>{
              
                $('#loading').hide() 
              })
          })
          $('#comment').append(btn).show()

          const cancel = $('<button>').text('Cancel')
          .addClass('btn btnCss')
          .click(function (event) {
            event.preventDefault();
           location.href ='http://localhost:3000/newsFeed'
          })
          $('#comment').append(cancel).show()
          
        })
     
        const likes = $('<button>')
        .text(showData.likes + ' Likes')
        .addClass('btn btnCss')
        
        .click(function (event){
          event.preventDefault()
      
          let url = 'http://localhost:3000/likes'
          const user = JSON.parse(localStorage.getItem('userInfo'))
          let data ={
            userName:user.username,
            postId:showData._id
          }
          $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify(data)
          }).then(function (showData) {
            location.href ='http://localhost:3000/newsFeed'
            
          })
          .catch(e=>{
           
          })
        })

        
        const user = JSON.parse(localStorage.getItem('userInfo'))
        let Edit,Delete;
       if(showData.userName == user.username){

        Edit = $('<button>')
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
            $('#loading').show() 
            $.ajax({
                url: editUrl,
                method: 'PUT',
                contentType: 'application/json', 
                data: JSON.stringify(data)
              }).then(function (showData) {
               console.log('loading')
                $('#loading').hide() 
                location.href ='http://localhost:3000/newsFeed'
                
              })
              .catch(e=>{
                
               // location.href ='http://localhost:3000/newsFeed'
                $('#loading').hide() 
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

        Delete = $(`<button>`)
        .text('Delete')
        .attr('id','delete')
        .addClass('btn btnCss')

        .click(function (event) {
            event.preventDefault();
          $('#loading').show() 
            const deleteUrl = `http://localhost:3000/delete/${encodeURIComponent(showData._id)}`;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
              }).then(function (showData) {
                fetchData();
                $('#loading').hide() 
              })
              .catch(e=>{
                $('#loading').hide() 
              })
              
          });
       }
    
        $('#show')
          .append(user_name,img,title,body,dl,likes,Edit? Edit:null,Delete ? Delete:null,Comment)
          .show();
    
        
      }

      $('#post-form').submit(function (event) {
        event.preventDefault();
        const title = $('#title').val().trim();
        const body = $('#body').val().trim();
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
      
        else {
          $('#error-message').hide();
          $('#errorBody').hide();
        const url = `http://localhost:3000/addNewPost`;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        let data = {
            userId: userInfo.userid,
            userName: userInfo.username,
            body:body,
            title:title
          
        }
        $('#loading').show() 
        $.ajax({
          url: url,
          method: 'POST',
          contentType: 'application/json', 
          data: JSON.stringify(data)
        }).then(function (data) {
          $('#loading').hide() 
          location.href='http://localhost:3000/newsFeed'
        })
        .catch(e=>{
          $('#loading').hide() 
        })
        
      }
      });


      $('#searchFriend').submit(function (event) {
        event.preventDefault();
        const userName = $('#search_term').val().trim();

        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    
        if (userName === '' || !/^[A-Za-z0-9]+$/.test(userName) || userName === userInfo.username) {
          $('#error').text('Please enter valid username').show();
          return; 
        } else {
          $('#error').empty();
        }
    
        const searchUrl = `http://localhost:3000/addfriends`;
      
        let body ={
          userName:userName,
          userId:userInfo.userid
        }
        $('#loading').show() 
        $.ajax({
          url: searchUrl,
          method: 'POST',
          contentType: 'application/json', 
          data: JSON.stringify(body)
        }).then(function (data) {
          $('#loading').hide() 
          loadFriend();
        })
        .catch(e=>{
          $('#loading').hide() 
          $('#error').text(e.responseJSON.error).show();
        })
      });
      

      function nameValidate(input){
        const result = /^[A-Za-z]+$/.test(input)
        return result;
      }
      function numberValidate(input){
        const result = /^[0-9]+$/.test(input)
        return result;
      }
      function userNameValidate(input){
        const result = /^[A-Za-z0-9]+$/.test(input)
        return result;
      }
      
      function emailValidate(input){
        const result = input.match(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/);
        return result;
      }
  

      $('#registration').submit(function (event) {
        event.preventDefault();
        const firstname = $('#firstname').val().trim();
        const lastname = $('#lastname').val().trim();
        const email = $('#email').val().trim();
        const phoneNumber = $('#phoneNumber').val().trim();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        $('#firstname-error').empty();
        $('#lastname-error').empty();
        $('#email-error').empty();
        $('#phoneNumber-error').empty();
        $('#username-error').empty();
        $('#password-error').empty();
        $('#error').empty();
        if (firstname === '' || !nameValidate(firstname)) {
          $('#firstname-error')
          .addClass('error')
          .text('First name must be letters').show();
          return; 
        }else if (lastname === '' || !nameValidate(lastname)) {
          $('#lastname-error')
          .addClass('error')
          .text('Last name must be letters').show();
          return; 
        }else if(!emailValidate(email)){
          $('#email-error')
          .addClass('error')
          .text('Invalid email address').show();
          return; 
        }else if(!numberValidate(phoneNumber) || phoneNumber.length !=10){
          $('#phoneNumber-error')
          .addClass('error')
          .text('Phone number must be 10 digits').show();
          return; 
        }else if(!userNameValidate(username)){
          $('#username-error')
          .addClass('error')
          .text('Please enter alphanumeric characte only').show();
          return; 
        }
         else if (password === '') {
          $('#password-error')
          .addClass('error')
          .text('Please enter password').show();
          return; 
        }else if ( !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/i.test(password)) {
          $('#password-error')
          .addClass('error')
          .text('Password must be between 6-18 characters long and have one letter, one special character, and one number. Special characters allowed: !@#$%^&* ').show();
          return; 
        }
         else {
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
        $('#loading').show();
        $.ajax({
          url: searchUrl,
          method: 'POST',
          contentType: 'application/json', 
          data:JSON.stringify(data)
        }).then(function (data) {
          $('#login-error').hide();
          $('#loading').hide();
          const message = $('<h1>').text('Registration Successful')
          .addClass('')
          location.reload();
          location.href ='/'

          $('#registration').append(message).show()
         
        })
        .catch(e =>{
          $('#loading').hide();
          $('#error').text(e.responseJSON.error).show();
        })
      })

     
      
  });

  
};
document.head.appendChild(script);


const login = ()=>{
  const username = $('#username').val().trim();
  const password = $('#password').val().trim();
  $('#password-error').empty();
  $('#username-error').empty();
  $('#login-error').empty();
  
  if (username === '' || !/^[A-Za-z0-9]+$/.test(username)) {
    $('#username-error').text('Please enter valid username').show();
    return; 
  }else if (password === '' || !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/i.test(password)) {
    $('#password-error').text('Please enter valid password').show();
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
  $('#loading').show() 
  $.ajax({
    url: searchUrl,
    method: 'POST',
    contentType: 'application/json', 
    data:JSON.stringify(data)
  }).then(function (data) {
 
    $('#login-error').hide();
    $('#loading').hide();
    const userInfo = {username : data.userName,userid : data._id}
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    location.href ='http://localhost:3000/newsFeed'
   
  })
  .catch(e =>{
    $('#loading').hide() 
    $('#login-error').text(e.responseJSON.error).show();
    
  })
  
}




