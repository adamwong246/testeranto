from typing import Any, Dict, List

class BaseWhen:
    def __init__(self, key: str, when_cb: Any):
        self.key = key
        self.when_cb = when_cb
        self.artifacts: List[str] = []
        self.error: Any = None
    
    async def and_when(
        self,
        store: Any,
        when_cb: Any,
        test_resource: Any,
        pm: Any
    ) -> Any:
        # Execute the when callback which should modify the store
        # The when_cb is typically a function that takes the store and returns the modified store
        if callable(when_cb):
            return when_cb(store)
        return store
    
    def add_artifact(self, path: str) -> None:
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    def to_obj(self) -> Dict[str, Any]:
        return {
            'name': self.key,
            'status': self.error is None,
            'error': str(self.error) if self.error else None,
            'artifacts': self.artifacts
        }
    
    async def and_when(
        self,
        store: Any,
        when_cb: Any,
        test_resource: Any,
        pm: Any
    ) -> Any:
        # Default implementation - can be overridden by subclasses
        return store
    
    async def test(
        self,
        store: Any,
        test_resource_configuration,
        t_log: Any,
        pm: Any,
        filepath: str
    ) -> Any:
        try:
            # Ensure add_artifact is properly bound to 'this'
            add_artifact = self.add_artifact
            # In Python, we can just pass self.add_artifact directly
            # For now, we'll implement a simple version
            result = await self.and_when(
                store,
                self.when_cb,
                test_resource_configuration,
                pm
            )
            return result
        except Exception as e:
            self.error = e
            raise e
