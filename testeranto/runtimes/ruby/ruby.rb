#!/usr/bin/env ruby
require 'json'
require 'bundler/setup'

def main
  # Check if we're in a Ruby project by looking for Gemfile
  unless File.exist?('Gemfile')
    puts "Error: Not a Ruby project (Gemfile not found)"
    exit 1
  end
  
  # Load dependencies
  dependencies = Bundler.definition.dependencies.map(&:name)
  
  config = {
    "ruby" => {
      "version" => RUBY_VERSION,
      "tests" => {
        "example/Calculator-test.rb" => {
          "path" => "example/Calculator-test.rb",
          "ports" => 0
        }
      },
      "dependencies" => dependencies,
      "rubocop_available" => dependencies.include?('rubocop')
    }
  }
  puts JSON.pretty_generate(config)
end

if __FILE__ == $0
  main
end
