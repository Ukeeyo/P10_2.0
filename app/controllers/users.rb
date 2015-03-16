enable :sessions

get '/login' do
  content_type :json
  user = User.find_by(username: params[:username])

  if session[:logged_in] == 'true'
    return {login: 'true', passed_name: session[:username]}.to_json

  elsif user != nil && user.authenticate(params[:password])
    session[:username] = user.username
    session[:user_id] = user.id
    session[:logged_in] = 'true'
    return {login: 'true', passed_name: session[:username]}.to_json
  else
    return {login: 'false', passed_name: params[:username]}.to_json
  end
end

post '/logout' do
  content_type :json
  session[:username] = ''
  session[:user_id] = ''
  session[:password] = ''
  session[:logged_in] = 'false'
end


post '/create/user' do
  content_type :json

  if params[:username].blank?
    error = "You must type in a username!".to_json
  elsif params[:password].blank?
    error = "You must type in a password!".to_json
  elsif User.find_by(username: params[:username]) != nil
    error = "The username #{params[:username]} has been taken".to_json
  else
    new_user = User.create(username: params[:username], password: params[:password], email: params[:email])
    no_error = "your account has been created, please sign in".to_json
  end

  # halt 501, "username can't be blank".to_json if params[:username].blank?
  # halt 502, "password can't be blank".to_json if params[:password].blank?
  # halt 503, "username is taken".to_json       if User.find_by(username: params[:username])

  # user = User.new(params[:user])

  # if user.save
  #   "everything's good".to_json
  # else
  #   "something broke".to_json
  # end

end

