module ActionView
  module Helpers
    module FormHelper
      
      def acceptance_form_for(*args, &block)
        form_for(*args, &block)
        Acceptance.set_form(nil)
      end
      
    end
  end
end
