import socket
import json
import random
import struct
from typing import Any, List, Dict, Optional
from ..types import ITTestResourceConfiguration

class PM_Python:
    def __init__(self, t: ITTestResourceConfiguration, ipc_file: str):

        print("PM_Python.__init__", ipc_file)

        self.test_resource_configuration = t
        self.client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        try:
            self.client.connect(ipc_file)
            # Set a timeout to prevent blocking forever
            self.client.settimeout(30.0)
        except Exception as e:
            raise e
    
    def start(self) -> None:
        raise Exception("DEPRECATED")
    
    def stop(self) -> None:
        try:
            self.client.close()
        except:
            pass
    
    def send(self, command: str, *args) -> Any:
        # Generate a unique key for this request
        key = str(random.random())
        # Create the message array with command, arguments, and key
        message = [command]
        message.extend(args)
        message.append(key)
        
        # Convert to JSON and encode
        data = json.dumps(message).encode('utf-8')
        
        # Send the length of the data first (as 4-byte big-endian)
        length = struct.pack('>I', len(data))
        self.client.sendall(length)
        # Send the actual data
        self.client.sendall(data)
        
        # Wait for response
        # First read the length
        length_data = self._recv_all(4)
        if not length_data:
            raise Exception("No response length received")
        response_length = struct.unpack('>I', length_data)[0]
        
        # Read the response data
        response_data = self._recv_all(response_length)
        if not response_data:
            raise Exception("No response data received")
        
        # Parse the response
        try:
            response = json.loads(response_data.decode('utf-8'))
            # Check if the response key matches our request key
            if response.get('key') == key:
                return response.get('payload')
            else:
                raise Exception(f"Key mismatch in response. Expected: {key}, Got: {response.get('key')}")
        except json.JSONDecodeError:
            raise Exception("Invalid JSON response")
    
    def _recv_all(self, length: int) -> bytes:
        data = b''
        while len(data) < length:
            chunk = self.client.recv(length - len(data))
            if not chunk:
                break
            data += chunk
        return data
    
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
        try:
            result = self.send("writeFileSync", full_path, contents, self.test_resource_configuration.name)
            return result
        except Exception as e:
            raise e
    
    async def create_write_stream(self, filepath: str) -> str:
        full_path = f"{self.test_resource_configuration.fs}/{filepath}"
        return self.send("createWriteStream", full_path, self.test_resource_configuration.name)
    
    async def end(self, uid: Any) -> bool:
        return self.send("end", uid)
    
    async def custom_close(self) -> Any:
        return self.send("customclose", self.test_resource_configuration.fs, self.test_resource_configuration.name)
