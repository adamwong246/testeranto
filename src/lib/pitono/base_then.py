from typing import Any, Dict, List, Callable, Optional

class BaseThen:
    def __init__(self, name: str, then_cb: Callable[[Any], Any]):
        self.name = name
        self.then_cb = then_cb
        self.error = False
        self.artifacts: List[str] = []
        self.status: Optional[bool] = None
    
    def add_artifact(self, path: str) -> None:
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    async def but_then(
        self,
        store: Any,
        then_cb: Callable[[Any], Any],
        test_resource_configuration: Any
    ) -> Any:
        # This should be implemented by subclasses
        raise NotImplementedError("but_then must be implemented by subclasses")
    
    def to_obj(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'error': self.error,
            'artifacts': self.artifacts,
            'status': self.status
        }
    
    async def test(
        self,
        store: Any,
        test_resource_configuration: Any,
        # t_log: Any,  # Removed to match TypeScript
        # pm: Any,     # Removed
        # filepath: str # Removed
    ) -> Any:
        try:
            result = await self.but_then(
                store,
                self.then_cb,
                test_resource_configuration
            )
            self.status = True
            return result
        except Exception as e:
            self.status = False
            self.error = True
            raise e
