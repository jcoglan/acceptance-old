class AcceptanceUser < ActiveRecord::Base
  
  validates_presence_of     :username,  :message => 'must be filled in'
  validates_size_of         :username,  :is => 6
  validates_format_of       :email,     :with => /^\w+\@\w+\.com$/i, :message => "must be a \"valid\" e'mail address"
  validates_confirmation_of :email,     :message => 'ought to be confirmed, really'
  validates_length_of       :email,     :minimum => 8, :message => 'is too short!'
  validates_acceptance_of   :terms
  validates_numericality_of :age, :only_integer => true, :even => true, :greater_than_or_equal_to => 13, :message => 'must be an even whole number greater than 13'
  
end
