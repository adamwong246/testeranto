//! Rusto - Rust implementation of Testeranto
//! 
//! This crate provides a Rust implementation of the Testeranto BDD testing framework.

pub mod types;
pub mod base_suite;
pub mod base_given;
pub mod base_when;
pub mod base_then;
pub mod simple_adapter;
pub mod rusto;

// Re-export main types for convenience
pub use types::*;
pub use base_suite::BaseSuite;
pub use base_given::BaseGiven;
pub use base_when::BaseWhen;
pub use base_then::BaseThen;
pub use simple_adapter::SimpleTestAdapter;
pub use rusto::Rusto;

/// Main entry point for creating a Rusto instance
pub fn rusto<I, O, M>(
    input: I::Iinput,
    test_specification: impl ITestSpecification<I, O>,
    test_implementation: ITestImplementation<I, O, M>,
    test_adapter: Box<dyn ITestAdapter<I>>,
    test_resource_requirement: ITTestResourceRequest,
) -> Rusto<I, O, M>
where
    I: IbddInAny + 'static,
    O: IbddOutAny + 'static,
    M: 'static,
{
    Rusto::new(
        input,
        test_specification,
        test_implementation,
        test_resource_requirement,
        test_adapter,
    )
}
