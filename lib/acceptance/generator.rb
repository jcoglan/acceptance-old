module Acceptance
  module Generator
    class << self
      
      def generate_script(form, object, name, fields, adapter)
        @object_name = name
        rules = fields.map { |field|
          validations = object.class.acceptance_rules.find_all { |r| r[:name] == field }
          validations.map { |v| __send__("#{v[:type]}_rule", v) }
        }.flatten
        
        <<-EOS

<script type="text/javascript">
if (#{adapter.first}) #{adapter.last}(function() { with(this) {
    form('#{form}')
        .#{rules.compact.join("\n        .")};
}});
</script>
        EOS
      end
      
    private
      
      def presence_rule(validation)
        return nil if skip_validation?(validation)
        "#{base_rule(validation)}.toBePresent(#{message_for(validation)})"
      end
      
      def acceptance_rule(validation)
        return nil if skip_validation?(validation)
        "#{base_rule(validation)}.toBeChecked(#{message_for(validation)})"
      end
      
      def confirmation_rule(validation)
        return nil if skip_validation?(validation)
        message = message_for(validation)
        message = ", #{message}" if message
        v = validation
        "requires('#{@object_name}[#{v[:name]}_confirmation]').toConfirm(#{field_for(validation)}#{message})"
      end
      
      def exclusion_rule(validation)
        return nil if skip_validation?(validation)
        list = validation[:options][:in].map(&:to_s).inspect
        message = message_for(validation)
        message = ", #{message}" if message
        "#{base_rule(validation)}.toBeNoneOf(#{list}#{message})"
      end
      
      def format_rule(validation)
        return nil if skip_validation?(validation)
        pattern = validation[:options][:with]
        flags = (pattern.options & Regexp::IGNORECASE).nonzero? ? 'i' : ''
        message = message_for(validation)
        message = ", #{message}" if message
        "#{base_rule(validation)}.toMatch(/#{pattern.source}/#{flags}#{message})"
      end
      
      def inclusion_rule(validation)
        return nil if skip_validation?(validation)
        list = validation[:options][:in].map(&:to_s).inspect
        message = message_for(validation)
        message = ", #{message}" if message
        "#{base_rule(validation)}.toBeNoneOf(#{list}#{message})"
      end
      
      def length_rule(validation)
        options = validation[:options]
        if options[:is]
          value = options[:is]
        else
          range = options[:within] || options[:in]
          min = range ? range.min : options[:minimum]
          max = range ? range.max : options[:maximum]
          value = "{#{[min && "minimum: #{min}", max && "maximum: #{max}"].compact.join(', ')}}"
        end
        message = message_for(validation)
        message = ", #{message}" if message
        "#{base_rule(validation)}.toHaveLength(#{value}#{message})"
      end
      alias :size_rule :length_rule
      
      def numericality_rule(validation)
        return nil if skip_validation?(validation)
        
        rules = []
        rules << "#{base_rule(validation)}.toBeNumeric(#{message_for(validation)})"
        
        return rules unless validation[:options][:message]
        
        message   = message_for(validation)
        message   = ", #{message}" if message
        name      = field_for(validation)
        o         = validation[:options]
        validator = validator_for(validation)
        error     = "errors.add(#{name}#{message}) })"
        
        rules << "#{validator} % 1 != 0) #{error}"                          if o[:only_integer]
        rules << "#{validator} <= #{o[:greater_than]}) #{error}"            if o[:greater_than]
        rules << "#{validator} < #{o[:greater_than_or_equal_to]}) #{error}" if o[:greater_than_or_equal_to]
        rules << "#{validator} >= #{o[:less_than]}) #{error}"               if o[:less_than]
        rules << "#{validator} > #{o[:less_than_or_equal_to]}) #{error}"    if o[:less_than_or_equal_to]
        rules << "#{validator} != #{o[:equal_to]}) #{error}"                if o[:equal_to]
        rules << "#{validator} % 2 == 0) #{error}"                          if o[:odd]
        rules << "#{validator} % 2 == 1) #{error}"                          if o[:even]
        
        rules
      end
      
      def base_rule(validation)
        "requires(#{field_for(validation)})"
      end
      
      def message_for(validation)
        message = validation[:options][:message]
        message.nil? ? nil : "\"#{message.inspect[1...-1]}\""
      end
      
      def field_for(validation)
        "'#{@object_name}[#{validation[:name]}]'"
      end
      
      def validator_for(validation)
        "validates(function(data, errors) { if(Number(data.get(#{field_for(validation)}))"
      end
      
      def skip_validation?(validation)
        options = validation[:options]
        return true if options[:allow_nil] or options[:allow_blank] or options[:on] or options[:if] or options[:unless]
        false
      end
      
    end
  end
end
