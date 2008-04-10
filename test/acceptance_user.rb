class AcceptanceUser < ActiveRecord::Base
  
  validates_presence_of :username
  validates_size_of :username, :is => 6
  validates_format_of :email, :with => /^\w+\@\w+\.com$/i, :message => "must be a \"valid\" e'mail address"
  validates_acceptance_of :terms
  validates_confirmation_of :email, :message => 'ought to be confirmed, really'
  validates_length_of :email, :minimum => 8, :message => 'is too short!'
  
end
