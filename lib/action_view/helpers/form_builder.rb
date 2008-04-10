module ActionView
  module Helpers
    class FormBuilder
      
      old_initialize = instance_method(:initialize)
      define_method(:initialize) do |object_name, object, template, options, proc|
        Acceptance.set_object(object, object_name)
        old_initialize.bind(self).call(object_name, object, template, options, proc)
      end
      
      %w(check_box hidden_field password_field text_area text_field).each do |helper|
        old_helper = instance_method(helper)
        define_method(helper) do |*args|
          Acceptance.add_field(args.first)
          old_helper.bind(self).call(*args)
        end
      end
      
    end
  end
end
