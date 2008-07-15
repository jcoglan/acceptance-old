module ActionView
  module Helpers
    module FormHelper
      
      def acceptance_form_for(*args, &block)
        form_for(*args, &block)
        concat(Acceptance.flush_rules, block.binding)
      end
      
      def acceptance_fields_for(*args, &block)
        fields_for(*args, &block)
        concat(Acceptance.flush_rules, block.binding)
      end
      
    end
  end
end
