require 'json'
require_relative 'Calculator'

# Since we don't have access to the full Rubeno library in this example,
# let's create a simple test runner
class SimpleTestRunner
  def initialize(calculator_class)
    @calculator_class = calculator_class
    @tests = []
    @results = []
  end
  
  def add_test(name, &block)
    @tests << { name: name, block: block }
  end
  
  def run
    puts "Running #{@tests.length} tests..."
    @tests.each do |test|
      begin
        instance = @calculator_class.new
        result = test[:block].call(instance)
        if result
          puts "✓ #{test[:name]}"
          @results << { name: test[:name], status: :passed }
        else
          puts "✗ #{test[:name]}"
          @results << { name: test[:name], status: :failed }
        end
      rescue StandardError => e
        puts "✗ #{test[:name]} - Error: #{e.message}"
        @results << { name: test[:name], status: :error }
      end
    end
    
    passed = @results.count { |r| r[:status] == :passed }
    failed = @results.count { |r| r[:status] == :failed }
    errors = @results.count { |r| r[:status] == :error }
    
    puts "\nSummary:"
    puts "  Passed: #{passed}"
    puts "  Failed: #{failed}"
    puts "  Errors: #{errors}"
    
    failed + errors == 0
  end
end

# Create test runner
runner = SimpleTestRunner.new(Calculator)

# Add tests
runner.add_test('basic addition') do |calc|
  calc.press('1').press('+').press('2').equals
  calc.get_display == '3'
end

runner.add_test('clear display') do |calc|
  calc.press('1').press('2').press('3').clear
  calc.get_display == ''
end

runner.add_test('memory operations') do |calc|
  calc.press('5').memory_store.clear.memory_recall
  calc.get_display == '5.0'
end

runner.add_test('memory addition') do |calc|
  calc.press('3').memory_store.clear
  calc.press('2').memory_add.clear.memory_recall
  calc.get_display == '5.0'
end

runner.add_test('complex expression') do |calc|
  calc.press('1').press('0').press('*').press('2').equals
  calc.get_display == '20'
end

# Run tests
if __FILE__ == $0
  success = runner.run
  exit(success ? 0 : 1)
end
