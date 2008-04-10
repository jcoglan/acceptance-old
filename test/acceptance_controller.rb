class AcceptanceController < ActionController::Base
  
  def create
    @user = AcceptanceUser.new
    render :file => File.dirname(__FILE__) + '/create.html.erb'
  end
  
end
