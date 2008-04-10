module ActionView
  module Helpers
    module FormHelper
      
      def acceptance_form_for(*args, &block)
        puts "\n\nHijacked!!\n\n"
        form_for(*args, &block)
      end
      
    end
  end
end
