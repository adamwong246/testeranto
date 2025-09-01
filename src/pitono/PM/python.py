import socket
import json
import random
from typing import Any, List, Dict, Optional
from ..types import ITTestResourceConfiguration

class PM_Python:
    def __init__(self, t: ITTestResourceConfiguration, ipc_file: str):
        self.test_resource_configuration = t
        print(f"DEBUG: Creating PM_Python with config: {t}")
        print(f"DEBUG: IPC file: {ipc_file}")
        self.client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        try:
            print(f"DEBUG: Attempting to connect to {ipc_file}")
            self.client.connect(ipc_file)
            print(f"DEBUG: Connected to IPC file: {ipc_file}")
        except Exception as e:
            print(f"DEBUG: Failed to connect to IPC file {ipc_file}: {e}")
            import traceback
            traceback.print_exc()
            raise e
    
    def start(self) -> None:
        raise Exception("DEPRECATED")
    
    def stop(self) -> None:
        raise Exception("stop not implemented.")
    
    def send(self, command: str, *argz) -> Any:
        key = str(random.random())
        # Create the message array with command, arguments, and key
        message = [command]
        message.extend(argz)
        message.append(key)
        data = json.dumps(message).encode('utf-8')
        print(f"DEBUG: Sending command '{command}' with key {key}")
        print(f"DEBUG: Message: {message}")
        try:
            self.client.send(data)
            print(f"DEBUG: Data sent successfully")
        except Exception as send_error:
            print(f"DEBUG: Error sending data: {send_error}")
            raise send_error
        
        # Wait for response
        buffer = b""
        while True:
            try:
                chunk = self.client.recv(4096)
                if not chunk:
                    print("DEBUG: No chunk received, breaking")
                    break
                print(f"DEBUG: Received chunk: {chunk}")
                buffer += chunk
                try:
                    # Try to parse the buffer as JSON
                    response_str = buffer.decode('utf-8')
                    print(f"DEBUG: Response string: {response_str}")
                    x = json.loads(response_str)
                    print(f"DEBUG: Parsed JSON: {x}")
                    if x.get('key') == key:
                        print(f"DEBUG: Key matched! Returning payload: {x.get('payload')}")
                        return x.get('payload')
                    else:
                        print(f"DEBUG: Key mismatch. Expected: {key}, Got: {x.get('key')}")
                    # If the key doesn't match, keep reading
                except json.JSONDecodeError as json_error:
                    # Incomplete JSON, continue reading
                    print(f"DEBUG: JSON decode error: {json_error}, buffer: {buffer}")
                    continue
                except UnicodeDecodeError as unicode_error:
                    # Handle encoding issues
                    print(f"DEBUG: Unicode decode error: {unicode_error}")
                    continue
            except Exception as recv_error:
                print(f"DEBUG: Error receiving data: {recv_error}")
                raise recv_error
        
        raise Exception("No valid response received")
    
    async def pages(self) -> List[str]:
        return self.send("pages")
    
    def wait_for_selector(self, p: str, s: str) -> Any:
        return self.send("waitForSelector", p, s)
    
    def close_page(self, p: Any) -> Any:
        return self.send("closePage", p)
    
    def goto(self, page: str, url: str) -> Any:
        return self.send("goto", page, url)
    
    async def new_page(self) -> str:
        return self.send("newPage")
    
    def __call__(self, selector: str, page: str) -> Any:
        return self.send("$", selector, page)
    
    def is_disabled(self, selector: str) -> bool:
        return self.send("isDisabled", selector)
    
    def get_attribute(self, selector: str, attribute: str, p: str) -> Any:
        return self.send("getAttribute", selector, attribute, p)
    
    def get_inner_html(self, selector: str, p: str) -> Any:
        return self.send("getInnerHtml", selector, p)
    
    def focus_on(self, selector: str) -> Any:
        return self.send("focusOn", selector)
    
    def type_into(self, selector: str) -> Any:
        return self.send("typeInto", selector)
    
    def page(self) -> Optional[str]:
        return self.send("page")
    
    def click(self, selector: str) -> Any:
        return self.send("click", selector)
    
    def screencast(self, opts: Dict, page: str) -> Any:
        adjusted_opts = dict(opts)
        if 'path' in adjusted_opts:
            adjusted_opts['path'] = f"{self.test_resource_configuration.fs}/{opts['path']}"
        return self.send("screencast", adjusted_opts, page, self.test_resource_configuration.name)
    
    def screencast_stop(self, p: str) -> Any:
        return self.send("screencastStop", p)
    
    def custom_screenshot(self, x: List) -> Any:
        opts = x[0]
        page = x[1] if len(x) > 1 else None
        
        adjusted_opts = dict(opts)
        if 'path' in adjusted_opts:
            adjusted_opts['path'] = f"{self.test_resource_configuration.fs}/{opts['path']}"
        
        if page:
            return self.send("customScreenShot", adjusted_opts, self.test_resource_configuration.name, page)
        else:
            return self.send("customScreenShot", adjusted_opts, self.test_resource_configuration.name)
    
    async def exists_sync(self, dest_folder: str) -> bool:
        path = f"{self.test_resource_configuration.fs}/{dest_folder}"
        return self.send("existsSync", path)
    
    def mkdir_sync(self) -> Any:
        path = f"{self.test_resource_configuration.fs}/"
        return self.send("mkdirSync", path)
    
    async def write(self, uid: int, contents: str) -> bool:
        return self.send("write", uid, contents)
    
    def write_file_sync(self, filepath: str, contents: str) -> bool:
        full_path = f"{self.test_resource_configuration.fs}/{filepath}"
        print(f"DEBUG: Attempting to write to: {full_path}")
        print(f"DEBUG: Test resource config: {self.test_resource_configuration}")
        try:
            result = self.send("writeFileSync", full_path, contents, self.test_resource_configuration.name)
            print(f"DEBUG: Write result: {result}")
            return result
        except Exception as e:
            print(f"DEBUG: Error in write_file_sync: {e}")
            import traceback
            traceback.print_exc()
            raise e
    
    async def create_write_stream(self, filepath: str) -> str:
        full_path = f"{self.test_resource_configuration.fs}/{filepath}"
        return self.send("createWriteStream", full_path, self.test_resource_configuration.name)
    
    async def end(self, uid: Any) -> bool:
        return self.send("end", uid)
    
    async def custom_close(self) -> Any:
        return self.send("customclose", self.test_resource_configuration.fs, self.test_resource_configuration.name)
