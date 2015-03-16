require 'dotenv'

def search_recipes(search_term)
response = Unirest.get "https://community-food2fork.p.mashape.com/search?key=#{ENV['SEARCH_KEY']}&q=" + (search_term.gsub(' ','+')),
  headers:{
    "X-Mashape-Key" => "#{ENV['MASHAPE_KEY']}",
    "Accept" => "application/json"
  }
  return response
end



def return_recipe_data(recipe_id)
response = Unirest.get "https://community-food2fork.p.mashape.com/get?key=#{ENV['SEARCH_KEY']}&rId=" + recipe_id,
  headers:{
    "X-Mashape-Key" => "#{ENV['MASHAPE_KEY']}",
    "Accept" => "application/json"
  }
  return response
end
