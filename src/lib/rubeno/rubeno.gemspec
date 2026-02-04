Gem::Specification.new do |s|
  
  s.version                   = "0.0.16"

  s.authors                   = ["Adam Wong"]
  s.bindir                    = "bin"
  s.date                      = %q{2010-04-03}
  s.description               = %q{The Ruby implementation of Testeranto}
  s.email                     =  %q{adamwong246@gmail.com}
  s.executables               = ["rubeno"] 
  s.files                     = Dir["Rakefile", "bin/rubeno", "lib/**/*.rb", "README.md", "rubeno.rb"]
  s.homepage                  = %q{http://rubygems.org/gems/rubeno}
  s.name                      = "rubeno"
  s.require_paths             = ["lib"]
  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.rubygems_version          = %q{1.6.2}
  s.summary                   = %q{The Ruby implementation of Testeranto}
  # s.test_files                = ["test/test_rubeno.rb"]
  

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end
