module ActionView
  module Helpers
    class FormBuilder
      
      old_initialize = instance_method(:initialize)
      define_method(:initialize) do |object_name, object, template, options, proc|
        Acceptance.object = object
        old_initialize.bind(self).call(object_name, object, template, options, proc)
      end
      
    end
  end
end
