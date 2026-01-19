module example

// LEAVE THIS AS ONE POINT TWENTY
go 1.20

replace github.com/adamwong246/testeranto => ../

replace github.com/adamwong246/testeranto/src/golingvu => ../src/lib/golingvu

require (
	github.com/adamwong246/testeranto/src/golingvu v0.0.0
)
