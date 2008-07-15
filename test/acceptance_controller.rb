class AcceptanceController < ActionController::Base
  
  def create
    @user, @other, @third, @fourth, @another = (1..5).map { |i| AcceptanceUser.new }
    render :file => File.dirname(__FILE__) + '/create.html.erb' and return unless request.xhr?
    render :file => File.dirname(__FILE__) + '/xhr.html.erb'
  end
  
end
