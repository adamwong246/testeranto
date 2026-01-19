class Calculator
  attr_reader :display, :memory, :values
  
  def initialize
    @display = ''
    @memory = 0
    @values = {}
  end
  
  def press(button)
    @display += button.to_s
    self
  end

  def display=(value)
    @display = value
  end

  def memory=(value)
    @memory = value
  end

  def values=(value)
    @values = value
  end
  
  def clear
    @display = ""
    self
  end
  
  def equals
    # Simple evaluation - in a real calculator, you'd want safer evaluation
    # Note: Using eval is generally unsafe, but for this example it's acceptable
    @display = eval(@display).to_s # rubocop:disable Security/Eval
  rescue StandardError
    @display = 'Error'
    self
  end
  
  def memory_store
    @memory = @display.to_f
    self
  end
  
  def memory_recall
    @display = @memory.to_s
    self
  end
  
  def memory_clear
    @memory = 0
    self
  end
  
  def memory_add
    @memory += @display.to_f
    self
  end
  
  def set_value(identifier, value)
    @values[identifier] = value
    self
  end
  
  def get_value(identifier)
    @values[identifier]
  end
  
  def get_display
    @display
  end
end
