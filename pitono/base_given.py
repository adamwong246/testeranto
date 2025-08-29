from typing import List, Dict, Any, Callable, Optional
from .types import Isubject, Istore, Iselection, Then, Given

class BaseGiven:
    def __init__(
        self,
        name: str,
        features: List[str],
        whens: List[Any],
        thens: List[Any],
        given_cb: Given,
        initial_values: Any
    ):
        self.name = name
        self.features = features or []
        self.whens = whens or []
        self.thens = thens or []
        self.given_cb = given_cb
        self.initial_values = initial_values
        self.artifacts: List[str] = []
        self.error: Optional[Exception] = None
        self.failed = False
        self.store: Optional[Istore] = None
        self.key: Optional[str] = None
    
    def add_artifact(self, path: str) -> None:
        # Normalize path separators
        normalized_path = path.replace('\\', '/')
        self.artifacts.append(normalized_path)
    
    def to_obj(self) -> Dict[str, Any]:
        return {
            'key': self.key,
            'name': self.name,
            'whens': [w.to_obj() if hasattr(w, 'to_obj') else {} for w in self.whens],
            'thens': [t.to_obj() if hasattr(t, 'to_obj') else {} for t in self.thens],
            'error': str(self.error) if self.error else None,
            'failed': self.failed,
            'features': self.features,
            'artifacts': self.artifacts
        }
    
    async def given_that(
        self,
        subject: Isubject,
        test_resource_configuration,
        artifactory: Callable[[str, Any], None],
        given_cb: Given,
        initial_values: Any,
        pm: Any
    ) -> Istore:
        raise NotImplementedError()
    
    async def after_each(
        self,
        store: Istore,
        key: str,
        artifactory: Callable[[str, Any], None],
        pm: Any
    ) -> Istore:
        return store
    
    def uber_catcher(self, e: Exception) -> None:
        self.error = e

    async def give(
        self,
        subject: Isubject,
        key: str,
        test_resource_configuration,
        tester: Callable[[Any], bool],
        artifactory: Callable[[str, Any], None],
        t_log: Callable[..., None],
        pm: Any,
        suite_ndx: int
    ) -> Istore:
        self.key = key
        t_log(f"\n {self.key}")
        t_log(f"\n Given: {self.name}")

        def given_artifactory(f_path: str, value: Any):
            artifactory(f"given-{key}/{f_path}", value)

        try:
            # Call given_that to set up the initial state
            self.store = await self.given_that(
                subject,
                test_resource_configuration,
                given_artifactory,
                self.given_cb,
                self.initial_values,
                pm
            )
        except Exception as e:
            self.failed = True
            self.error = e
            raise e

        try:
            # Process whens
            for when_ndx, when_step in enumerate(self.whens):
                await when_step.test(
                    self.store,
                    test_resource_configuration,
                    t_log,
                    pm,
                    f"suite-{suite_ndx}/given-{key}/when/{when_ndx}"
                )
            
            # Process thens
            for then_ndx, then_step in enumerate(self.thens):
                result = await then_step.test(
                    self.store,
                    test_resource_configuration,
                    t_log,
                    pm,
                    f"suite-{suite_ndx}/given-{key}/then-{then_ndx}"
                )
                tester(result)
        except Exception as e:
            self.error = e
            self.failed = True
            raise e
        finally:
            try:
                await self.after_each(self.store, self.key, given_artifactory, pm)
            except Exception as e:
                self.failed = True
                raise e

        return self.store
