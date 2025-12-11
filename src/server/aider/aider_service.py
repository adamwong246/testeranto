#!/usr/bin/env python3
import asyncio
import json
import sys
import os
from pathlib import Path
import websockets
import subprocess
import threading
import queue
import time

class AiderInstance:
    def __init__(self, instance_id, test_name, runtime, workspace_path, initial_files=None):
        self.instance_id = instance_id
        self.test_name = test_name
        self.runtime = runtime
        self.workspace_path = Path(workspace_path)
        self.files = set(initial_files or [])
        
        # Create input/output queues for communication
        self.input_queue = queue.Queue()
        self.output_queue = queue.Queue()
        self.command_queue = queue.Queue()
        
        # Aider process
        self.process = None
        self.running = False
        
    def start(self):
        """Start the aider instance in a separate thread"""
        if self.running:
            return
            
        self.running = True
        self.aider_thread = threading.Thread(target=self._run_aider, daemon=True)
        self.aider_thread.start()
        
        # Initialize with initial files
        if self.files:
            self.add_files(list(self.files))
    
    def _run_aider(self):
        """Main aider loop running in background thread"""
        try:
            # Build aider command with initial files
            aider_args = [
                "aider",
                "--yes",  # Auto-confirm
                "--dark-mode",
            ]
            
            # Check for model configuration
            model_from_env = os.environ.get('AIDER_MODEL')
            if model_from_env:
                aider_args.extend(["--model", model_from_env])
            else:
                # Default to GPT-4 if available
                aider_args.extend(["--model", "gpt-4"])
            
            # Add initial files
            for file_path in self.files:
                abs_path = self.workspace_path / file_path
                if abs_path.exists():
                    aider_args.append(str(file_path))
            
            print(f"Starting aider for {self.test_name} with command: {' '.join(aider_args)}")
            
            # Start aider process
            self.process = subprocess.Popen(
                aider_args,
                cwd=str(self.workspace_path),
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1,
                universal_newlines=True,
                env={**os.environ, **self._get_aider_env()}  # Pass environment with API keys
            )
            
            # Start threads to handle input/output
            threading.Thread(target=self._handle_stdout, daemon=True).start()
            threading.Thread(target=self._handle_stderr, daemon=True).start()
            threading.Thread(target=self._handle_input, daemon=True).start()
            threading.Thread(target=self._handle_commands, daemon=True).start()
            
            # Wait for process to complete
            self.process.wait()
            
        except Exception as e:
            self.output_queue.put(f"Error in aider process: {str(e)}")
            self.running = False
    
    def _get_aider_env(self):
        """Get environment variables for aider process"""
        env = {}
        
        # Copy relevant API key environment variables
        api_key_vars = [
            'OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'DEEPSEEK_API_KEY',
            'GOOGLE_API_KEY', 'GROQ_API_KEY', 'MISTRAL_API_KEY',
            'COHERE_API_KEY', 'TOGETHER_API_KEY'
        ]
        
        for var in api_key_vars:
            if os.environ.get(var):
                env[var] = os.environ[var]
        
        return env
    
    def _handle_stdout(self):
        """Handle stdout from aider process"""
        if self.process and self.process.stdout:
            for line in iter(self.process.stdout.readline, ''):
                if line:
                    self.output_queue.put(line.strip())
    
    def _handle_stderr(self):
        """Handle stderr from aider process"""
        if self.process and self.process.stderr:
            for line in iter(self.process.stderr.readline, ''):
                if line:
                    self.output_queue.put(f"ERROR: {line.strip()}")
    
    def _handle_input(self):
        """Handle input from user"""
        while self.running:
            try:
                user_input = self.input_queue.get(timeout=0.1)
                if user_input and self.process and self.process.stdin:
                    self.process.stdin.write(user_input + "\n")
                    self.process.stdin.flush()
            except queue.Empty:
                continue
            except Exception as e:
                self.output_queue.put(f"Error sending input: {str(e)}")
    
    def _handle_commands(self):
        """Handle commands from server"""
        while self.running:
            try:
                command = self.command_queue.get(timeout=0.1)
                self._process_command(command)
            except queue.Empty:
                continue
            except Exception as e:
                self.output_queue.put(f"Error processing command: {str(e)}")
    
    def _process_command(self, command):
        """Process commands from server (e.g., add/drop files)"""
        cmd_type = command.get('type')
        
        if cmd_type == 'add_files':
            files = command.get('files', [])
            self.add_files(files)
        elif cmd_type == 'drop_files':
            files = command.get('files', [])
            self.drop_files(files)
        elif cmd_type == 'inject':
            text = command.get('text', '')
            if text:
                self.input_queue.put(text)
        elif cmd_type == 'message':
            # Send a one-time message to aider
            message = command.get('message', '')
            if message:
                self.input_queue.put(message)
    
    def add_files(self, files):
        """Add files to aider context"""
        for file_path in files:
            abs_path = self.workspace_path / file_path
            if abs_path.exists():
                self.files.add(str(file_path))
                # Send /add command to aider
                self.input_queue.put(f"/add {file_path}")
                self.output_queue.put(f"Added file: {file_path}")
    
    def drop_files(self, files):
        """Remove files from aider context"""
        for file_path in files:
            abs_path = self.workspace_path / file_path
            file_str = str(file_path)
            if file_str in self.files:
                self.files.remove(file_str)
                # Send /drop command to aider
                self.input_queue.put(f"/drop {file_path}")
                self.output_queue.put(f"Removed file: {file_path}")
    
    def send_command(self, command):
        """Send command from server to this aider instance"""
        self.command_queue.put(command)
    
    def get_output(self):
        """Get any pending output"""
        outputs = []
        while not self.output_queue.empty():
            outputs.append(self.output_queue.get())
        return outputs
    
    def stop(self):
        """Stop the aider instance"""
        self.running = False
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()

class AiderPool:
    def __init__(self, host="0.0.0.0", port=8765):
        self.host = host
        self.port = port
        self.instances = {}  # instance_id -> AiderInstance
        self.next_instance_id = 1
        self.next_terminal_port = 9000
    
    async def handle_websocket(self, websocket, path):
        """Handle WebSocket connections for terminal clients"""
        try:
            async for message in websocket:
                data = json.loads(message)
                action = data.get('action')
                
                if action == 'create':
                    # Create new aider instance
                    instance_id = f"aider-{self.next_instance_id}"
                    self.next_instance_id += 1
                    
                    test_name = data.get('test_name', 'unknown')
                    runtime = data.get('runtime', 'node')
                    workspace = data.get('workspace', os.getcwd())
                    initial_files = data.get('initial_files', [])
                    
                    instance = AiderInstance(
                        instance_id, test_name, runtime, workspace, initial_files
                    )
                    instance.start()
                    
                    self.instances[instance_id] = instance
                    
                    # Return connection info
                    terminal_port = self.next_terminal_port
                    self.next_terminal_port += 1
                    
                    await websocket.send(json.dumps({
                        'status': 'created',
                        'instance_id': instance_id,
                        'terminal_port': terminal_port,
                        'terminal_host': 'localhost'
                    }))
                    
                    # Start terminal bridge for this instance
                    asyncio.create_task(self.start_terminal_bridge(instance, terminal_port))
                    
                elif action == 'command':
                    # Send command to existing instance
                    instance_id = data.get('instance_id')
                    command = data.get('command')
                    
                    if instance_id in self.instances:
                        instance = self.instances[instance_id]
                        instance.send_command(command)
                        await websocket.send(json.dumps({
                            'status': 'command_sent',
                            'instance_id': instance_id
                        }))
                    else:
                        await websocket.send(json.dumps({
                            'status': 'error',
                            'error': f'Instance {instance_id} not found'
                        }))
                        
                elif action == 'get_output':
                    # Get output from instance
                    instance_id = data.get('instance_id')
                    
                    if instance_id in self.instances:
                        instance = self.instances[instance_id]
                        outputs = instance.get_output()
                        await websocket.send(json.dumps({
                            'status': 'output',
                            'instance_id': instance_id,
                            'outputs': outputs
                        }))
                        
                elif action == 'message':
                    # Send a one-time message to an aider instance
                    instance_id = data.get('instance_id')
                    message = data.get('message')
                    
                    if instance_id in self.instances and message:
                        instance = self.instances[instance_id]
                        instance.send_command({
                            'type': 'message',
                            'message': message
                        })
                        await websocket.send(json.dumps({
                            'status': 'message_sent',
                            'instance_id': instance_id
                        }))
                        
        except Exception as e:
            print(f"WebSocket error: {e}")
    
    async def start_terminal_bridge(self, instance, port):
        """Create TCP server for terminal clients to connect to"""
        async def handle_terminal_client(reader, writer):
            """Handle terminal client connection"""
            addr = writer.get_extra_info('peername')
            print(f"Terminal client connected from {addr}")
            
            try:
                # Send welcome message
                welcome = f"\nConnected to aider for test: {instance.test_name}\n"
                welcome += f"Instance ID: {instance.instance_id}\n"
                welcome += f"Type 'exit' to disconnect\n\n"
                writer.write(welcome.encode())
                await writer.drain()
                
                # Task to send aider output to terminal
                async def send_output():
                    while True:
                        outputs = instance.get_output()
                        for output in outputs:
                            writer.write(output.encode() + b"\n")
                            await writer.drain()
                        await asyncio.sleep(0.1)
                
                output_task = asyncio.create_task(send_output())
                
                # Read input from terminal
                while True:
                    data = await reader.read(1024)
                    if not data:
                        break
                    
                    user_input = data.decode().strip()
                    if user_input.lower() == 'exit':
                        break
                    
                    # Send to aider
                    instance.input_queue.put(user_input)
                
                # Cleanup
                output_task.cancel()
                writer.close()
                await writer.wait_closed()
                print(f"Terminal client {addr} disconnected")
                
            except Exception as e:
                print(f"Terminal bridge error: {e}")
                writer.close()
        
        # Start TCP server
        server = await asyncio.start_server(handle_terminal_client, '0.0.0.0', port)
        print(f"Terminal bridge started on port {port}")
        
        async with server:
            await server.serve_forever()
    
    async def start(self):
        """Start the aider pool"""
        print(f"Starting aider pool on {self.host}:{self.port}")
        async with websockets.serve(self.handle_websocket, self.host, self.port):
            print(f"Aider pool WebSocket server ready")
            await asyncio.Future()  # Run forever

async def main():
    pool = AiderPool()
    
    # Log API key configuration status
    print("=== API Key Configuration ===")
    
    # Check if .aider.conf.yml exists in the workspace
    config_path = "/workspace/.aider.conf.yml"
    if os.path.exists(config_path):
        print(f"✓ .aider.conf.yml file found at {config_path}")
        try:
            with open(config_path, 'r') as f:
                first_line = f.readline().strip()
                print(f"  First line: {first_line}")
        except Exception as e:
            print(f"  Could not read config file: {e}")
    else:
        print(f"⚠ .aider.conf.yml file not found at {config_path}")
    
    api_keys_configured = []
    
    if os.environ.get('OPENAI_API_KEY'):
        api_keys_configured.append('OpenAI')
    if os.environ.get('ANTHROPIC_API_KEY'):
        api_keys_configured.append('Anthropic')
    if os.environ.get('DEEPSEEK_API_KEY'):
        api_keys_configured.append('DeepSeek')
    if os.environ.get('GOOGLE_API_KEY'):
        api_keys_configured.append('Google')
    if os.environ.get('GROQ_API_KEY'):
        api_keys_configured.append('Groq')
    if os.environ.get('MISTRAL_API_KEY'):
        api_keys_configured.append('Mistral')
    if os.environ.get('COHERE_API_KEY'):
        api_keys_configured.append('Cohere')
    if os.environ.get('TOGETHER_API_KEY'):
        api_keys_configured.append('Together')
    
    if api_keys_configured:
        print(f"API keys configured for: {', '.join(api_keys_configured)}")
        # Check if keys are valid (not empty)
        for provider in api_keys_configured:
            env_var_name = f"{provider.upper()}_API_KEY"
            key = os.environ.get(env_var_name)
            if key and len(key.strip()) > 10:  # Basic validation
                print(f"  ✓ {provider}: Key present")
            else:
                print(f"  ⚠ {provider}: Key may be invalid or empty")
    else:
        print("WARNING: No API keys configured in environment variables")
        print("Aider will prompt for API keys when needed")
        print("You can configure API keys in:")
        print("  1. .aider.conf.yml file in project root")
        print("  2. .env file in project root")
        print("  3. Environment variables")
    
    await pool.start()

if __name__ == "__main__":
    asyncio.run(main())
