require 'bcrypt'
class User < ActiveRecord::Base
  has_many :recipes
  has_many :lists

  include BCrypt

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  def create
    @user = User.new(params[:user])
    @user.password = params[:password]
    @user.save!
  end

  def login
    @user = User.find_by(username: params[:username])
    if @user.password == params[:password]
      give_token
    # else
    #   redirect_to home_url ## TOOK THIS OUT BECAUSE WE REDIRECT IN INDEX CONTROLLER
    end
  end

  def authenticate(password)
    self.password == password
  end
end
