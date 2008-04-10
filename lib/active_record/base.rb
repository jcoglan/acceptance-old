module ActiveRecord
  class Base
    cattr_reader :acceptance_rules
    @@acceptance_rules = []
    
    class << self
      
      old_presence = instance_method(:validates_presence_of)
      define_method(:validates_presence_of) do |*attr_names|
        attr_names.each do |attr_name|
          next if attr_name.is_a?(Hash)
          @@acceptance_rules << { :name => attr_name.to_s, :type => :presence }
        end
        old_presence.bind(self).call(*attr_names)
      end
      
      old_format = instance_method(:validates_format_of)
      define_method(:validates_format_of) do |*attr_names|
        options = attr_names.last.is_a?(Hash) ? attr_names.last : {}
        attr_names.each do |attr_name|
          next if attr_name.is_a?(Hash)
          @@acceptance_rules << { :name => attr_name.to_s, :type => :format, :format => options[:with], :message => options[:message] }
        end
        old_format.bind(self).call(*attr_names)
      end
      
    end
  end
end
