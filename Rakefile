require 'rake'

desc 'Run all tests'
task :test do
  puts 'Running Calculator tests...'
  ruby 'example/Calculator-test.rb'
end

desc 'Run a specific test'
task :run_test, [:test_name] do |t, args|
  puts "Running test: #{args.test_name}"
  # This is a placeholder for more specific test running
  ruby 'example/Calculator-test.rb'
end

desc 'Start interactive console'
task :console do
  puts 'Starting IRB console with Calculator loaded...'
  exec 'irb -r ./example/Calculator.rb'
end

task default: :test
