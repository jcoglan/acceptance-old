require 'fileutils'

dir = File.dirname(__FILE__)
source = "#{dir}/javascripts/acceptance.js"
target = "#{dir}/../../../public/javascripts/acceptance.js"

if (File.file?(target))
  puts "It seems you already have a JavaScript file called 'acceptance.js'. You can"
  puts "find the script you need in vendor/plugins/acceptance/javascripts/acceptance.js"
  puts "Remember to include this script in your pages to use this plugin."
else
  FileUtils.copy(source, target)
  puts "We've added a JavaScript file to your app in public/javascripts/acceptance.js"
  puts "You'll need to add this script to your pages to use this plugin."
end
