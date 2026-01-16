from typing import Any, Dict, List, Callable, Optional

class BaseWhen:
    def __init__(self, name: str, when_cb: Callable[[Any], Any]):
        self.name = name
        self.when_cb = when_cb
        self.error: Optional[Exception] = None
        self.artifacts: List[str] = []
        self.status: Optional[bool] = None
    
    def add_artifact(self, path: str) -> None:
        if not isinstance(path, str):
            raise TypeError(
                f"[ARTIFACT ERROR] Expected string, got {type(path)}: {path}"
            )
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    async def and_when(
        self,
        store: Any,
        when_cb: Callable[[Any], Any],
        test_resource_configuration: Any
    ) -> Any:
        # This should be implemented by subclasses
        raise NotImplementedError("and_when must be implemented by subclasses")
    
    def to_obj(self) -> Dict[str, Any]:
        error_str = None
        if self.error:
            error_str = f"{type(self.error).__name__}: {str(self.error)}"
        return {
            'name': self.name,
            'status': self.status,
            'error': error_str,
            'artifacts': self.artifacts
        }
    
    async def test(
        self,
        store: Any,
        test_resource_configuration: Any,
        # t_log: Any,  # Removed to match TypeScript
        # pm: Any,     # Removed to match TypeScript
        # filepath: str # Removed to match TypeScript
    ) -> Any:
        try:
            result = await self.and_when(
                store,
                self.when_cb,
                test_resource_configuration
            )
            self.status = True
            return result
        except Exception as e:
            self.status = False
            self.error = e
            raise e
