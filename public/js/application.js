$(document).ready(function() {
  user.checkLogin();

  $( '#password_box' ).keypress(function(e) {
    if(e.which == 13) {
      password = document.getElementById( "password_box" ).value;
      username = document.getElementById( "username_box" ).value;
      user.login(username, password);
    }
  });

  $( '#search_box' ).keypress(function(e) {
    if(e.which == 13) {
      var term = $( '#search_box' ).val();
      console.log('searching for' + term);
      recipro.search(term);
    }
  });

  $( '#logout' ).on( "click", function() {
    user.logout();
    $('#login_container').show();
  });

  $( '#account_creation_button' ).on( "click", function() {
    user.showAccountcreation();
  });
});


var user = (function(){

  function login(user, pass){
    $.ajax({
      url: '/login',
      type: 'GET',
      dataType: 'json',
      data: {username: user, password: pass}
    })
    .done(function(data) {
      console.log(data.login);
      if (data.login === 'true') {
        $('#login_container').hide();
        recipro.getRecipeid();
        recipro.populateGrocery();
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }

  function logout() {
    $.ajax({
      url: '/logout',
      type: 'post',
    })
    .done(function() {
      console.log("logged out");
      location.reload();
    })
    .fail(function() {
      console.log("logout error");
    })
    .always(function() {
      console.log("complete logout request");
    });

  }

  function checkLogin() {
    $.getJSON('/login', function(json, textStatus) {
      if (json.login === 'false') {
        $('#login_container').show();
      } else {
        recipro.getRecipeid();
        recipro.populateGrocery();
      }
    });
  }

  function showAccountcreation() {
    $('#account_setup').appendTo('#login_container').show('slow');
    setupCreationform();
  }

  function setupCreationform(){
    $( '#account_creation_form' ).on('submit', function() {
      $.post('/create/user', {username: $( '#create_username' ).val(), password: $( '#create_password' ).val(), email: newEmail = $( '#create_email' ).val()}, function(data, textStatus, xhr) {
        $( '#errors' ).replaceWith( "<p id='errors'>"+data+"</p>" );
      });
    });
  }


  return {
    login: login,
    logout: logout,
    checkLogin: checkLogin,
    showAccountcreation: showAccountcreation,
  };

}());





var recipro = (function(){

  function search(term) {
    $.getJSON('/search', {search: term}, function(json, textStatus) {
        // console.log(json.body.recipes);
        console.log('success');
        $( '#search_head' ).replaceWith( "<div class='found_recipe' id='search_head'></div>" );
        displaySearch(json.body.recipes);
        addButtonlistener();
      });
  }

  function displaySearch(results) {
    console.log(results);

    function addText(text) {
      $('#results_container').append("<div id='new_search' class='found_recipe' style='display: none;'><p>"+text.title+"</p>"+"<img src="+text.image_url+" class='recipe_image'><button id ="+text.recipe_id+" class ='add_recipe'>Add to my recipes!</button></div>");

      $('#new_search').appendTo('#search_head').show('slow');
      $('#new_search').removeAttr('id');

    }
    results.forEach(addText);
  }


  function addRecipe(id) {
    $.post('/add', {recipe_id: id}, function(data, textStatus, xhr) {
      getSinglerecipe(id);
    });

  }


  function addButtonlistener() {
    $( '.add_recipe' ).on( "click", function() {
      id = this.id;
      addRecipe(id);
    });
  }

  function getRecipeid() {
    $.getJSON('/get/recipe', function(json, textStatus) {
      json.forEach(getRecipedata);
    });
  }

  function getRecipedata(recipe) {
    $.getJSON('/recipe/data', {recipe_id: recipe.food2fork_id}, function(json, textStatus) {

      $('#saved_container').append("<div id='new_recipe' class='found_recipe' style='display: none;'><p>"+json.body.recipe.title+"</p>"+"<img src="+json.body.recipe.image_url+" class='recipe_image'>"+"<button id"+json.body.recipe.recipe_id+" class ='add_to_grocery'>Add to my grocery list!</button>"+"</div>");

      $('#new_recipe').appendTo('#saved_head').fadeIn('slow');
      $('#new_recipe').removeAttr('id');

      addGrocerybuttonListener( json.body.recipe.ingredients );

    });
  }

  function getSinglerecipe(id) {
    $.getJSON('/recipe/data', {recipe_id: id}, function(json, textStatus) {
      $('#saved_container').append("<div id='new_recipe' class='found_recipe' style='display: none;'><p>"+json.body.recipe.title+"</p>"+"<img src="+json.body.recipe.image_url+" class='recipe_image'>"+"<button id ="+json.body.recipe.recipe_id+" class ='add_to_grocery'>Add to my grocery list!</button>"+"</div>");

      $('#new_recipe').appendTo('#saved_head').fadeIn('slow');
      $('#new_recipe').removeAttr('id');

      addGrocerybuttonListener( json.body.recipe.ingredients );
    });
  }

  function addGrocerybuttonListener( ingredients ) {
    $( '.add_to_grocery' ).on( "click", function() {

      ingredients.forEach(function(ingredient){
        addIngredienttoDatabase(ingredient);
      });
    });
  }

  function addIngredienttoDatabase( ingredient ) {
    $.getJSON('/add/ingredient', {ingredient: ingredient}, function(json, textStatus) {
      addIngredienttoList( ingredient, json);
    });
  }

  function addIngredienttoList( ingredient, id ) {
    $( '#grocery_container ul' ).append("<p><li id='li"+id+"'>"+ingredient+"<button id="+id+">Purchased!</button></li></p>");
    checkoffListener(id);
  }

  function checkoffListener(buttonId) {
    $( "#"+buttonId ).on( "click", function() {
      $( "#li"+buttonId ).addClass( "strikeout" );
      databaseRemoveingredient(buttonId);
    });
  }

  function databaseRemoveingredient(id) {
    $.ajax({
      url: '/delete/ingredient',
      type: 'delete',
      dataType: 'json',
      data: {id: id},
    })
    .done(function() {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }

  function populateGrocery() {
    $.getJSON('/saved/list', function(json, textStatus) {
      json.forEach(function(object){
        addIngredienttoList(object.ingredients, object.id);
      });
    });
  }

  return {
    search: search,
    getRecipeid: getRecipeid,
    populateGrocery: populateGrocery,
  };

}());



