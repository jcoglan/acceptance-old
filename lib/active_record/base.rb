module ActiveRecord
  class Base
    cattr_reader :acceptance_rules
    @@acceptance_rules = []
    
    class << self
      
      old_presence = instance_method(:validates_presence_of)
      define_method(:validates_presence_of) do |*attr_names|
        attr_names.each { |attr_name| @@acceptance_rules << {:name => attr_name.to_s, :type => :presence} }
        old_presence.bind(self).call(*attr_names)
      end
      
    end
  end
end
