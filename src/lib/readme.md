# lib

This folder represents testeranto internals.

## layers

Testeranto's core architecture is built in layers.

0. abstractBase.ts - The lowest layer is composed of abstract BDD classes
1. baseBuilder.ts - this layer extends the classes in `abstractBase` with the capacity to run and log tests.
2. classBuilder.ts - this layer extends the classes in `baseBuilder` with the capacity to accept custom implementations of of abstract BDD classes in `abstractBase`
3. core.ts - this layer extends the classes in `classBuilder` with the capacity to accept an input, a specification, a implementation a test resource requirement and an adapter, and to map those entities to custom implementations of of abstract BDD classes in `abstractBase`.
