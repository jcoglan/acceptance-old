require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'
require 'packr'
require 'fileutils'

desc 'Default: run unit tests.'
task :default => :test

desc 'Test the acceptance plugin.'
Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.pattern = 'test/**/*_test.rb'
  t.verbose = true
end

desc 'Generate documentation for the acceptance plugin.'
Rake::RDocTask.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'Acceptance'
  rdoc.options << '--line-numbers' << '--inline-source'
  rdoc.rdoc_files.include('README')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

desc 'Build JavaScript library'
task :build do
  code = File.read('javascripts/acceptance.src.js')
  code = Packr.pack(code, :shrink_vars => true, :private => true)
  File.open('javascripts/acceptance.js', 'wb') { |f| f.write code }
  FileUtils.copy('javascripts/acceptance.js', '../../../public/javascripts/acceptance.js')
end
