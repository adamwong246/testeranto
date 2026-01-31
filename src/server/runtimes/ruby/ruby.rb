# TODO
# confFilePath is a ruby file. its unused for now
# const configFilePath = process.argv[2];
# const testName = process.argv[3] || "allTests";
#
# write inputFiles.json to
# testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json
#
# write a dummy ruby file
# testeranto/bundles/allTests/ruby/example/Calculator.test.rb
# in this dummy ruby file, execute 'example/Calculator-test.rb'
# =======
require 'json'
require 'fileutils'

puts "hello ruby builder", ARGV

# config_file_path is a ruby file
config_file_path = ARGV[0]
# Ensure the config file path is valid before requiring
if File.exist?(config_file_path)
  require config_file_path
else
  puts "Config file not found: #{config_file_path}"
  exit(1)
end

test_name = ARGV[1] || "allTests"

input_files_path = "testeranto/bundles/allTests/ruby/example/Calculator.test.rb-inputFiles.json"
dummy_ruby_file_path = "testeranto/bundles/allTests/ruby/example/Calculator.test.rb"

input_files_content = {
  hello: 'world',
}
FileUtils.mkdir_p(File.dirname(input_files_path))
File.write(input_files_path, JSON.pretty_generate(input_files_content))

# Write a dummy Ruby file
dummy_ruby_content = <<-RUBY
# Dummy Ruby file to execute the test
require_relative '../../../../../example/Calculator-test'
RUBY

FileUtils.mkdir_p(File.dirname(dummy_ruby_file_path))
File.write(dummy_ruby_file_path, dummy_ruby_content)
