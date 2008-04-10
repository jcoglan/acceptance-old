module ActionView
  module Helpers
    module FormTagHelper
      
      old_html_options_for_form = instance_method(:html_options_for_form)
      
    private
      define_method(:html_options_for_form) do |*args|
        options = old_html_options_for_form.bind(self).call(*args)
        Acceptance.form = options['id']
        options
      end
      
    end
  end
end
