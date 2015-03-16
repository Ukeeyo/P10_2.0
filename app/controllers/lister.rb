get '/' do
  erb :home
end

get '/search' do
  content_type :json
  results = search_recipes(params[:search])
  return results.to_json
end

get '/saved/list' do
  content_type :json
  list = User.find(session[:user_id]).lists
  return list.to_json
end

get '/get/recipe' do

  content_type :json
  recipe_list = []
  User.find(session[:user_id]).recipes.each do |recipe|
    recipe_list << recipe
  end

  return recipe_list.to_json
end

get '/recipe/data' do
  content_type :json
  return return_recipe_data(params[:recipe_id]).to_json
end

post '/add' do
  new_recipe = User.find(session[:user_id]).recipes.create(food2fork_id: params[:recipe_id])
end

get '/add/ingredient' do
  new_ingredient = User.find(session[:user_id]).lists.create(ingredients: params[:ingredient])
  return new_ingredient.id.to_json
end


delete '/delete/ingredient' do
  content_type :json
  User.find(session[:user_id]).lists.find(params[:id]).destroy
end


# put '/list' do
#   return_recipe_data(params[:recipe_id])['ingredients'].each do |list_item|
#     User.find(session[:user_id]).lists.create(ingredients: list_item)
#   end
# end
# get '/my/list' do
#   @list = ç

#   user_recipes = User.find(session[:user_id]).recipes
#   @recipe_data = []

#   user_recipes.each do |recipe|
#     @recipe_data << return_recipe_data(recipe.food2fork_id)
#   end

#   erb :my_list
# end

# delete '/my/list/delete/:recipe_id' do
#   User.find(session[:user_id]).recipes.find_by(food2fork_id: params[:recipe_id]).destroy
#   redirect '/my/list'
# end





