require 'fileutils'

dir = File.dirname(__FILE__)
source = "#{dir}/javascripts/acceptance.js"
target = "#{dir}/../../../public/javascripts/acceptance.js"
FileUtils.copy(source, target)
