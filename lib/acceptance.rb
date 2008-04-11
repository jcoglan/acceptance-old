require 'acceptance/generator'

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
      form = nil
      Generator.generate_script(@form_id, @object, @object_name, @fields, ADAPTERS[adapter])
    end
    
  end
end
