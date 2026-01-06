from typing import Any, Dict, List

class BaseThen:
    def __init__(self, key: str, then_cb: Any):
        self.key = key
        self.then_cb = then_cb
        self.error = False
        self.artifacts: List[str] = []
    
    async def but_then(
        self,
        store: Any,
        then_cb: Any,
        test_resource_configuration,
        pm: Any
    ) -> Any:
        # Execute the then callback which should perform assertions
        # The then_cb is typically a function that takes the store and performs checks
        if callable(then_cb):
            return then_cb(store)
        return True
    
    def add_artifact(self, path: str) -> None:
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    def to_obj(self) -> Dict[str, Any]:
        return {
            'name': self.key,
            'error': self.error,
            'artifacts': self.artifacts,
            'status': not self.error
        }
    
    async def but_then(
        self,
        store: Any,
        then_cb: Any,
        test_resource_configuration,
        pm: Any
    ) -> Any:
        # Default implementation - can be overridden by subclasses
        return True
    
    async def test(
        self,
        store: Any,
        test_resource_configuration,
        t_log: Any,
        pm: Any,
        filepath: str
    ) -> Any:
        try:
            add_artifact = self.add_artifact
            # Simple implementation for now
            result = await self.but_then(
                store,
                self.then_cb,
                test_resource_configuration,
                pm
            )
            return result
        except Exception as e:
            self.error = True
            raise e
