from typing import Any, Dict, List

class BaseThen:
    def __init__(self, name: str, then_cb: Any):
        self.name = name
        self.then_cb = then_cb
        self.error = False
        self.artifacts: List[str] = []
    
    def add_artifact(self, path: str) -> None:
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    def to_obj(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'error': self.error,
            'artifacts': self.artifacts
        }
    
    async def but_then(
        self,
        store: Any,
        then_cb: Any,
        test_resource_configuration,
        pm: Any
    ) -> Any:
        raise NotImplementedError()
    
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
