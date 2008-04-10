module Acceptance
  class << self
  
    @form_id = nil
    
    def set_form(id)
      @form_id = id.nil? ? nil : id.to_s
      puts "\n\nForm id: #{@form_id}\n\n"
    end
  
  end
end
