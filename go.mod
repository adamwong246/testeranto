module github.com/adamwong246/testeranto

go 1.19

// The binary will be built to testeranto/bundles/golang/ using explicit build commands

replace github.com/adamwong246/testeranto => ../

require github.com/adamwong246/testeranto/src/golingvu v0.0.0-20250912215240-9a7ba91edeed // indirect
