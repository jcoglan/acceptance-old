module ActiveRecord
  class Base
    
    class << self
      attr_reader :acceptance_rules
      
      %w(acceptance confirmation exclusion format inclusion length numericality presence size).each do |type|
        old_method = instance_method("validates_#{type}_of")
        define_method("validates_#{type}_of") do |*attr_names|
          options = attr_names.last.is_a?(Hash) ? attr_names.last : {}
          attr_names.each do |attr_name|
            next if attr_name.is_a?(Hash)
            @acceptance_rules ||= []
            @acceptance_rules << { :name => attr_name.to_s, :type => type, :options => options }
          end
          old_method.bind(self).call(*attr_names)
        end
      end
      
    end
  end
end
