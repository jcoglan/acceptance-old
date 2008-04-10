class AcceptanceUser < ActiveRecord::Base
  
  validates_presence_of :username
  validates_format_of :email, :with => /^\w+\@\w+\.com$/i, :message => 'must be a valid email address'
  
end
