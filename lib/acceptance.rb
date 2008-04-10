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
        validations.map { |v| "form('#{@form_id}').requires('#{@object_name}[#{field}]');" }
      }.flatten
      form = nil
      <<-EOS
      
      <script type="text/javascript">
        if (window.Acceptance) Acceptance(function() { with(this) {
          #{rules.join("\n          ")}
        }});
      </script>
      EOS
    end
  
  end
end
