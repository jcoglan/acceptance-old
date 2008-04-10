module ActionView
  module Helpers
    module FormHelper
      
      def acceptance_form_for(*args, &block)
        form_for(*args, &block)
        Acceptance.form = nil
      end
      
    end
  end
end
