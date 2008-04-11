module Acceptance
  class << self
    
    ADAPTERS = {
      :prototype    => ['window.Acceptance', 'Acceptance'],
      :ojay         => ['window.Ojay', 'Ojay.Forms']
    }
    
    def adapter=(library)
      library = library.to_sym
      return nil unless ADAPTERS.keys.include?(library)
      @chosen_adapter = library
    end
    
    def adapter
      @chosen_adapter || :prototype
    end
    
    def form=(id)
      @form_id = id.nil? ? nil : id.to_s
      set_object(nil) if @form_id.nil?
    end
    
    def has_form?
      !(@form_id.nil? or @form_id.to_s.empty?)
    end
    
    def set_object(object, name = nil)
      @object, @object_name = object, name
      @fields = [] if object
    end
    
    def add_field(method)
      @fields << method.to_s unless @fields.include?(method)
    end
    
    def flush_rules
      return "" unless has_form? and @object
      puts @adapters.inspect
      rules = @fields.map { |field|
        validations = @object.class.acceptance_rules.find_all { |r| r[:name] == field }
        validations.map { |v| __send__("#{v[:type]}_rule", v) }
      }.flatten
      form = nil
      <<-EOS
      
      <script type="text/javascript">
        if (#{ADAPTERS[adapter].first}) #{ADAPTERS[adapter].last}(function() { with(this) {
            form('#{@form_id}')
                .#{rules.compact.join("\n                .")};
        }});
      </script>
      EOS
    end
    
  private
    
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
      
      rules << "#{validator} % 1 != 0) errors.add(#{name}#{message}) })" if o[:only_integer]
      rules << "#{validator} <= #{o[:greater_than]}) errors.add(#{name}#{message}) })" if o[:greater_than]
      rules << "#{validator} < #{o[:greater_than_or_equal_to]}) errors.add(#{name}#{message}) })" if o[:greater_than_or_equal_to]
      rules << "#{validator} >= #{o[:less_than]}) errors.add(#{name}#{message}) })" if o[:less_than]
      rules << "#{validator} > #{o[:less_than_or_equal_to]}) errors.add(#{name}#{message}) })" if o[:less_than_or_equal_to]
      rules << "#{validator} != #{o[:equal_to]}) errors.add(#{name}#{message}) })" if o[:equal_to]
      rules << "#{validator} % 2 == 0) errors.add(#{name}#{message}) })" if o[:odd]
      rules << "#{validator} % 2 == 1) errors.add(#{name}#{message}) })" if o[:even]
      
      rules
    end
    
  end
end
