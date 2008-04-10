module Acceptance
  class << self
  
    @form_id = nil
    @object = nil
    
    def form=(id)
      @form_id = id.nil? ? nil : id.to_s
      object = nil if @form_id.nil?
    end
    
    def has_form?
      !(@form_id.nil? or @form_id.to_s.empty?)
    end
    
    def object=(object)
      @object = object
      puts "\n\n#{object.inspect}\n\n"
    end
  
  end
end
