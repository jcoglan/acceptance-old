class AcceptanceUser < ActiveRecord::Base
  
  validates_length_of :username, :within => 4..100
  validates_format_of :email, :with => /^\w+\@\w+\.com$/i, :message => 'must be a valid email address'
  
end
