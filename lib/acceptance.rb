module Acceptance
  class << self
    
    @form_id = nil
    @object = nil
    
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
      rules = @fields.map { |field|
        validations = @object.class.acceptance_rules.find_all { |r| r[:name] == field }
        validations.map { |v| __send__("#{v[:type]}_rule", v) }
      }.flatten
      form = nil
      <<-EOS
      
      <script type="text/javascript">
        if (window.Acceptance) Acceptance(function() { with(this) {
          form('#{@form_id}')
              .#{rules.join("\n              .")};
        }});
      </script>
      EOS
    end
    
  private
    
    def base_rule(validation)
      "requires('#{@object_name}[#{validation[:name]}]')"
    end
    
    def message_for(validation)
      message = validation[:options][:message]
      message.nil? ? nil : "\"#{message.inspect[1...-1]}\""
    end
    
    def presence_rule(validation)
      "#{base_rule(validation)}"
    end
    
    def acceptance_rule(validation)
      "#{base_rule(validation)}.toBeChecked(#{message_for(validation)})"
    end
    
    def confirmation_rule(validation)
      message = message_for(validation)
      message = ", #{message}" if message
      v = validation
      "requires('#{@object_name}[#{v[:name]}_confirmation]').toConfirm('#{@object_name}[#{v[:name]}]'#{message})"
    end
    
    def format_rule(validation)
      pattern = validation[:options][:with]
      flags = (pattern.options & Regexp::IGNORECASE).nonzero? ? 'i' : ''
      message = message_for(validation)
      message = ", #{message}" if message
      "#{base_rule(validation)}.toMatch(/#{pattern.source}/#{flags}#{message})"
    end
    
  end
end
