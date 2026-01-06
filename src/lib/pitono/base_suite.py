from typing import Dict, List, Any, Callable, Optional

class BaseSuite:
    def __init__(self, name: str, givens: Dict[str, Any]):
        self.name = name
        self.givens = givens
        self.store: Any = None
        self.test_resource_configuration: Any = None
        self.index: int = 0
        self.failed = False
        self.fails = 0
        self.artifacts: List[str] = []
    
    def add_artifact(self, path: str) -> None:
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    def features(self) -> List[str]:
        features = []
        seen = set()
        for given in self.givens.values():
            for feature in given.features:
                if feature not in seen:
                    features.append(feature)
                    seen.add(feature)
        return features
    
    def to_obj(self) -> Dict[str, Any]:
        givens = [given.to_obj() for given in self.givens.values()]
        return {
            'name': self.name,
            'givens': givens,
            'fails': self.fails,
            'failed': self.failed,
            'features': self.features(),
            'artifacts': self.artifacts
        }
    
    async def setup(
        self,
        s: Any,
        artifactory: Callable[[str, Any], None],
        tr: Any,
        pm: Any
    ) -> Any:
        return s
    
    def assert_that(self, t: Any) -> bool:
        return bool(t)
    
    def after_all(self, store: Any, artifactory: Callable[[str, Any], None], pm: Any) -> Any:
        return store
    
    async def run(
        self,
        input_val: Any,
        test_resource_configuration,
        artifactory: Callable[[str, Any], None],
        t_log: Callable[..., None],
        pm: Any
    ) -> 'BaseSuite':
        self.test_resource_configuration = test_resource_configuration
        
        def suite_artifactory(f_path: str, value: Any):
            artifactory(f'suite-{self.index}-{self.name}/{f_path}', value)
        
        subject = await self.setup(
            input_val,
            suite_artifactory,
            test_resource_configuration,
            pm
        )
        
        # Reset fails counter
        self.fails = 0
        self.failed = False
        
        for g_key, g in self.givens.items():
            try:
                self.store = await g.give(
                    subject,
                    g_key,
                    test_resource_configuration,
                    self.assert_that,
                    suite_artifactory,
                    t_log,
                    pm,
                    self.index
                )
                # Add any failures from the given to the suite total
                if hasattr(g, 'failed') and g.failed:
                    self.fails += 1
            except Exception as e:
                self.failed = True
                self.fails += 1
                # Log the error but continue with other givens
                print(f"Error in given {g_key}:", str(e))
        
        # Mark the suite as failed if there are any failures
        if self.fails > 0:
            self.failed = True
        
        try:
            self.after_all(self.store, artifactory, pm)
        except Exception as e:
            print(f"Error in after_all: {e}")
        
        return self
    
    # Add missing properties to match TypeScript
    @property
    def test_resource_configuration(self) -> Any:
        return self._test_resource_configuration
    
    @test_resource_configuration.setter
    def test_resource_configuration(self, value: Any):
        self._test_resource_configuration = value
    
    @property
    def index(self) -> int:
        return self._index
    
    @index.setter
    def index(self, value: int):
        self._index = value
    
    @property
    def failed(self) -> bool:
        return self._failed
    
    @failed.setter
    def failed(self, value: bool):
        self._failed = value
    
    @property
    def fails(self) -> int:
        return self._fails
    
    @fails.setter
    def fails(self, value: int):
        self._fails = value
    
    @property
    def artifacts(self) -> List[str]:
        return self._artifacts
    
    @artifacts.setter
    def artifacts(self, value: List[str]):
        self._artifacts = value
