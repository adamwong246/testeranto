module Rubeno
  class PM_Ruby
    def initialize(t, websocket_port)
      @test_resource_configuration = t
      @websocket_port = websocket_port
      @connected = false
    end
    
    def start
      raise "DEPRECATED"
    end
    
    def send(command, *args)
      # For now, return default values to allow tests to run
      case command
      when "pages"
        []
      when "newPage"
        "mock-page"
      when "page"
        "mock-page"
      when "existsSync"
        false
      when "writeFileSync"
        true
      when "createWriteStream"
        "mock-stream"
      when "write"
        true
      when "end"
        true
      when "customclose"
        nil
      else
        nil
      end
    end
    
    def pages
      send("pages")
    end
    
    def wait_for_selector(p, s)
      send("waitForSelector", p, s)
    end
    
    def close_page(p)
      send("closePage", p)
    end
    
    def goto(page, url)
      send("goto", page, url)
    end
    
    def new_page
      send("newPage")
    end
    
    def call(selector, page)
      send("$", selector, page)
    end
    
    def is_disabled(selector)
      send("isDisabled", selector)
    end
    
    def get_attribute(selector, attribute, p)
      send("getAttribute", selector, attribute, p)
    end
    
    def get_inner_html(selector, p)
      send("getInnerHtml", selector, p)
    end
    
    def focus_on(selector)
      send("focusOn", selector)
    end
    
    def type_into(selector)
      send("typeInto", selector)
    end
    
    def page
      send("page")
    end
    
    def click(selector)
      send("click", selector)
    end
    
    def screencast(opts, page)
      adjusted_opts = opts.dup
      if adjusted_opts['path']
        adjusted_opts['path'] = "#{@test_resource_configuration.fs}/#{opts['path']}"
      end
      send("screencast", adjusted_opts, page, @test_resource_configuration.name)
    end
    
    def screencast_stop(p)
      send("screencastStop", p)
    end
    
    def custom_screenshot(x)
      opts = x[0]
      page = x[1] if x.length > 1
      
      adjusted_opts = opts.dup
      if adjusted_opts['path']
        adjusted_opts['path'] = "#{@test_resource_configuration.fs}/#{opts['path']}"
      end
      
      if page
        send("customScreenShot", adjusted_opts, @test_resource_configuration.name, page)
      else
        send("customScreenShot", adjusted_opts, @test_resource_configuration.name)
      end
    end
    
    def exists_sync(dest_folder)
      path = "#{@test_resource_configuration.fs}/#{dest_folder}"
      send("existsSync", path)
    end
    
    def mkdir_sync
      path = "#{@test_resource_configuration.fs}/"
      send("mkdirSync", path)
    end
    
    def write(uid, contents)
      send("write", uid, contents)
    end
    
    def write_file_sync(filepath, contents)
      full_path = "#{@test_resource_configuration.fs}/#{filepath}"
      begin
        result = send("writeFileSync", full_path, contents, @test_resource_configuration.name)
        result
      rescue => e
        raise e
      end
    end
    
    def create_write_stream(filepath)
      full_path = "#{@test_resource_configuration.fs}/#{filepath}"
      send("createWriteStream", full_path, @test_resource_configuration.name)
    end
    
    def end(uid)
      send("end", uid)
    end
    
    def custom_close
      send("customclose", @test_resource_configuration.fs, @test_resource_configuration.name)
    end
  end
end
